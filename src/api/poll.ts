import type { components } from '@octokit/openapi-types';
import { Observer, Subject, Subscription } from 'rxjs';
import { createDebugLogger } from "@/utils/debug";

export type GithubEvent = components['schemas']['event']
const WS_URL = 'wss://api.ossinsight.io/websocket';

interface BaseRequest {
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

export interface SamplingRequest extends BaseRequest {
  /**
   * Sampling rate. It means that N events are received that satisfy the conditions but only one of them is returned to the front end. If you want all of them, you need set it to 1.
   */
  samplingRate: number;

  filter?: string[];
}

export interface LoopRequest extends BaseRequest {
  /**
   * Fixed loop time. Server will send message to Client by per loop time. Unit is millsecond, and must be larger than 500.
   */
  loopTime: number;

  /**
   * Whether send event details to Client, default is false.
   */
  detail?: boolean;
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
    let data: string
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
  apiVersion: number
}

export interface RawSamplingFirstMessage extends FirstMessage {
  eventMap: Record<string, string>;
  yearCountMap: {
    dev: number
    merge: number
    open: number
  },
  dayCountMap: {
    dev: number
    merge: number
    open: number
  }
}

export class ConnectionSource<T, F extends FirstMessage> extends Subject<T> {
  private readonly stateListener: ((state: ConnectionState) => void)[] = [];
  public readonly firstMessage = new Subject<F>();
  public lastFirstMessage?: F;
  public apiVersion: number | undefined;
  private conn: Connection | undefined = undefined;
  private debug = createDebugLogger('ws');
  private handleMessage = (event: MessageEvent) => {
    const firstMessage: F = JSON.parse(event.data);
    if (!this.lastFirstMessage && firstMessage.firstMessageTag) {
      this.apiVersion = firstMessage.apiVersion
      this.debug('firstMessage', firstMessage);
      this.firstMessage.next(firstMessage);
      this.lastFirstMessage = firstMessage;
      this.conn?.sendInitialMessage()
    } else {
      this.next(JSON.parse(event.data));
    }
  };

  onStateChange(cb: (state: ConnectionState) => void) {
    this.stateListener.push(cb);
  }

  stateChange(state: ConnectionState) {
    this.stateListener.forEach(cb => cb(state));
  }

  subscribe(observer?: Partial<Observer<T>> | ((value: T) => void) | null): Subscription {
    const s = super.subscribe(observer as any);
    this.debug('subscribe');

    s.add(() => {
      this.debug('teardown');
    });
    if (this.observed && !this.conn) {
      const theConn = this.conn = new Connection(this.type, this.initReq);
      this.stateChange(ConnectionState.CONNECTING);
      theConn.addEventListener('open', () => {
        this.debug('connect');
        this.stateChange(ConnectionState.CONNECTED);
      }, { once: true });
      theConn.addEventListener('close', () => {
        this.lastFirstMessage = undefined;
        this.stateChange(ConnectionState.CLOSED);
      }, { once: true });
      theConn.addEventListener('error', () => {
        this.stateChange(ConnectionState.ERROR);
      }, { once: true });

      const subscribe = (conn: Connection) => {
        conn.addEventListener("message", this.handleMessage);
      };

      if (theConn.readyState === WebSocket.OPEN) {
        subscribe(theConn);
      } else {
        theConn.addEventListener('open', () => subscribe(theConn), { once: true });
      }
    }

    s.add(() => {
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

  constructor(private type: string, private initReq?: any) {
    super();
  }
}

export function sampling<Event = Partial<GithubEvent>>(req: SamplingRequest): ConnectionSource<Event, RawSamplingFirstMessage> {
  return new ConnectionSource('sampling', req);
}
