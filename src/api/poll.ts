import type { components } from '@octokit/openapi-types';
import { fromEvent, map } from 'rxjs';

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

  constructor(endpoint: string, private initialMessage?: string | object, private reInitialize: boolean = false) {
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
    if (this.initialized && !this.reInitialize) {
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

export function sampling(req: SamplingRequest) {
  const conn = new Connection('sampling', req, true);
  conn.init();
  return {
    source: fromEvent<MessageEvent>(conn, 'message').pipe(map(event => JSON.parse(event.data))),
    dispose: () => {
      conn.close();
    },
  };
}
