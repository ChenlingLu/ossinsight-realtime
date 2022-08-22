import type { components } from '@octokit/openapi-types';
import { Observable, Subject, Subscriber } from 'rxjs';
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

  private sendInitialMessage() {
    const initialMessage = this.initialMessage;
    if (typeof initialMessage === 'undefined' || initialMessage === null) {
      return;
    }
    if (typeof initialMessage === 'string') {
      this.send(initialMessage);
    } else {
      this.send(JSON.stringify(initialMessage));
    }
  }

  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    if (this.readyState === 0) {
      this.addEventListener('open', () => {
        this.sendInitialMessage();
      });
    } else if (this.readyState === 1) {
      this.sendInitialMessage();
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
}

export interface RawSamplingFirstMessage extends FirstMessage {
  eventMap: Record<string, string>;
}

export class ConnectionSource<T, F extends FirstMessage> extends Observable<T> {
  private readonly stateListener: ((state: ConnectionState) => void)[] = [];
  public readonly firstMessage: Subject<F> = new Subject<F>();

  onStateChange(cb: (state: ConnectionState) => void) {
    this.stateListener.push(cb);
  }

  stateChange(state: ConnectionState) {
    this.stateListener.forEach(cb => cb(state));
  }

  constructor(type: string, initReq?: any) {
    const debug = createDebugLogger('ws');

    let conn: Connection | undefined = undefined;
    let subscribers: Set<Subscriber<T>> = new Set();
    super(subscriber => {
      debug('subscribe');
      subscribers.add(subscriber);

      const handleMessage = (event: MessageEvent) => {
        const firstMessage = JSON.parse(event.data);
        if (firstMessage.firstMessageTag) {
          debug('firstMessage', firstMessage);
          this.firstMessage.next(firstMessage);
        } else {
          subscriber.next(JSON.parse(event.data));
        }
      };

      const subscribe = (conn: Connection) => {
        conn.addEventListener("message", handleMessage);
      };

      const tryTearDown = () => {
        debug('teardown');
        if (conn) {
          subscribers.delete(subscriber);
          if (subscribers.size === 0) {
            if (conn.readyState === WebSocket.OPEN) {
              conn.close();
            }
            conn.removeEventListener('message', handleMessage);
            conn.removeEventListener('close', handleClose);
            conn.removeEventListener('error', handleError);
          }
        }
      };

      // init or reopen new one
      if (!conn || conn.readyState >= WebSocket.CLOSING) {
        const theConn = conn = new Connection(type, initReq);
        this.stateChange(ConnectionState.CONNECTING);
        theConn.addEventListener('open', () => {
          debug('open');
          theConn.init();
          this.stateChange(ConnectionState.CONNECTED);
        }, { once: true });
        theConn.addEventListener('close', () => {
          this.stateChange(ConnectionState.CLOSED);
        }, { once: true });
        theConn.addEventListener('error', () => {
          this.stateChange(ConnectionState.ERROR);
        }, { once: true });
      }

      if (conn.readyState === WebSocket.OPEN) {
        subscribe(conn);
      } else {
        // wait ready
        let theConn = conn;
        theConn.addEventListener('open', () => subscribe(theConn), { once: true });
      }

      const handleClose = () => {
        debug('close');
        subscriber.complete();
        subscriber.unsubscribe();
      };
      const handleError = () => {
        debug('error');
        subscriber.error(new Error('websocket error'));
        subscriber.unsubscribe();
      };

      conn.addEventListener('close', handleClose);
      conn.addEventListener('error', handleError);

      subscriber.add(tryTearDown);
    });
  }
}

export function sampling<Event = Partial<GithubEvent>>(req: SamplingRequest): ConnectionSource<Event, RawSamplingFirstMessage> {
  return new ConnectionSource('sampling', req);
}
