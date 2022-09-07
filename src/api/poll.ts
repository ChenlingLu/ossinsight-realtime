import { Observer, Subject, Subscription } from 'rxjs';
import { createDebugLogger } from "@/utils/debug";
import { ref } from "vue";

const WS_URL = 'wss://api.ossinsight.io/websocket';

export interface SamplingRequest {
  /**
   * Sampling rate. It means that N events are received that satisfy the conditions but only one of them is returned to the front end. If you want all of them, you need set it to 1.
   */
  samplingRate: number;

  filter?: string[];

  /**
   * Specify the event type you want to see. If you don't set it, all event types will be returned.
   */
  eventType?: string;

  /**
   * Specify the repo name you want to see. If you don't set it, all repo names will be returned.
   */
  repoName?: string;

  /**
   * Specify the user name you want to see. If you don't set it, all user names will be returned.
   */
  userName?: string;

  returnType?: 'map' | 'list';

}

class Connection extends WebSocket {
  private initialized: boolean;

  constructor(endpoint: string, private initialMessage?: string | object) {
    super(`${WS_URL}/${endpoint}`);
    this.initialized = false;
  }

  sendInitialMessage() {
    const initialMessage = this.initialMessage;
    if (typeof initialMessage === 'undefined' || initialMessage === null) {
      return;
    }
    let data: string;
    if (typeof initialMessage === 'string') {
      data = initialMessage;
    } else {
      data = JSON.stringify(initialMessage);
    }
    if (this.readyState === 0) {
      this.addEventListener('open', () => {
        this.send(data);
      }, { once: true });
    } else if (this.readyState === 1) {
      this.send(data);
    }
  }
}

export const enum ConnectionState {
  CONNECTING,
  CONNECTED,
  CLOSED,
  ERROR,
}

export interface FirstMessage {
  firstMessageTag: true;
  apiVersion: number;
}

export interface RawSamplingFirstMessage extends FirstMessage {
  eventMap: Record<string, string>;
  devMap: Record<string, string>;
  mergeMap: Record<string, string>;
  openMap: Record<string, string>;
  sumMap: {
    additions: string;
    deletions: string;
    dev: string;
    repo: string;
  }
}

export class ConnectionSource<T, F extends FirstMessage> extends Subject<T> {
  public readonly firstMessage = ref<F>();
  public readonly connectionState = ref(ConnectionState.CONNECTING);
  public apiVersion: number | undefined;
  private conn: Connection | undefined = undefined;
  private debug = createDebugLogger('ws');

  private handleFirstMessage = (event: MessageEvent) => {
    const firstMessage: F = JSON.parse(event.data);
    this.debug('firstMessage', firstMessage);
    this.apiVersion = firstMessage.apiVersion;
    this.firstMessage.value = firstMessage;
    this.adaptVersion?.(this, this.apiVersion);
    this.conn?.sendInitialMessage();
    this.conn?.addEventListener('message', this.handleMessage);
  };

  private handleMessage = (event: MessageEvent) => {
    this.next(this.process(JSON.parse(event.data)));
  };

  stateChange(state: ConnectionState) {
    this.connectionState.value = state;
  }

  subscribe(observer?: Partial<Observer<T>> | ((value: T) => void) | null): Subscription {
    const s = super.subscribe(observer as any);
    this.debug('subscribe');

    s.add(() => {
      this.debug('teardown');
    });

    // connect ws if not
    if (this.observed && !this.conn) {
      const theConn = this.conn = new Connection(this.type, this.initReq);
      this.stateChange(ConnectionState.CONNECTING);
      theConn.addEventListener('open', () => {
        this.debug('connect');
        this.stateChange(ConnectionState.CONNECTED);
      }, { once: true });
      theConn.addEventListener('close', () => {
        this.stateChange(ConnectionState.CLOSED);
      }, { once: true });
      theConn.addEventListener('error', () => {
        this.stateChange(ConnectionState.ERROR);
      }, { once: true });

      const subscribe = (conn: Connection) => {
        conn.addEventListener("message", this.handleFirstMessage, { once: true });
      };

      if (theConn.readyState === WebSocket.OPEN) {
        subscribe(theConn);
      } else {
        theConn.addEventListener('open', () => subscribe(theConn), { once: true });
      }
    }

    s.add(() => {
      // disconnect if not observed
      if (!this.observed && this.conn) {
        this.debug('disconnect');
        const conn = this.conn;
        if (conn.readyState === WebSocket.OPEN) {
          conn.close();
        }
        conn.removeEventListener('message', this.handleMessage);
        this.conn = undefined;
      }
    });
    return s;
  }

  constructor(private type: string, private initReq?: any, private process: (raw: any) => T = t => t, private adaptVersion?: (self: ConnectionSource<T, F>, apiVersion: number) => void) {
    super();
  }
}

export function sampling<T>(req: SamplingRequest, process: (raw: any) => T): ConnectionSource<T, RawSamplingFirstMessage> {
  return new ConnectionSource('sampling', req, process);
}
