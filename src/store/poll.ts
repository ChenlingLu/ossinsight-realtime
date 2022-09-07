import { acceptHMRUpdate, defineStore } from "pinia";
import { ConnectionSource, FirstMessage, RawSamplingFirstMessage, sampling, SamplingRequest } from "@/api/poll";
import { markRaw } from "vue";

export type CreatePoller<P, T, F extends FirstMessage> = (params: P) => ConnectionSource<T, F>

function poll<TMap extends Record<K, T>, F extends FirstMessage, K extends string = string & keyof TMap, T = TMap[K], R extends Record<K, any> = any>(name: string, createPoller: CreatePoller<R[K], T, F>, options: R) {
  return function createUsePoll(type: K) {
    const param = options[type];
    const storeName = `poll/${name}/${type}`;

    const useStore = defineStore(storeName, {
      state: () => ({
        stream: markRaw(createPoller(param)),
      }),
      actions: {},
      getters: {
        firstMessage: state => state.stream.firstMessage,
        state: state => state.stream.connectionState
      },
    });

    if (import.meta.hot) {
      import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
    }

    return useStore;
  };
}

export type RawFilteredEvent = any[]

export interface FilteredEvent {
  id: number;
  action: string;
  pr: number;
  repoName: string;
  actorLogin: string;
  language: string;
  additions: string;
  deletions: string;
  merged: string;
  isDevDay: number;
  isDevYear: number;
  isRepoYear: number;
  prEventType: 'opened' | 'reopened' | 'closed' | 'merged';
}

type FilterConfig = {
  field: keyof FilteredEvent;
  path: string;
}

const PR_EVENTS_POLL_CONFIG: FilterConfig[] = [
  { field: 'id', path: 'event.id' },
  { field: 'action', path: 'event.payload.action' },
  { field: 'pr', path: 'event.payload.pull_request.number' },
  { field: 'repoName', path: 'event.repo.name' },
  { field: 'actorLogin', path: 'event.actor.login' },
  { field: 'merged', path: 'event.payload.pull_request.merged' },
  { field: 'language', path: 'event.payload.pull_request.base.repo.language' },
  { field: 'additions', path: 'event.payload.pull_request.additions' },
  { field: 'deletions', path: 'event.payload.pull_request.deletions' },
  { field: 'isDevDay', path: 'payload.devDay' },
  { field: 'isDevYear', path: 'payload.devYear' },
  { field: 'isRepoYear', path: 'payload.repoYear' },
];

export function process(raw: RawFilteredEvent): FilteredEvent {
  let res = {} as FilteredEvent;
  for (let i = 0; i < PR_EVENTS_POLL_CONFIG.length; i++) {
    // @ts-ignore
    res[PR_EVENTS_POLL_CONFIG[i].field] = raw[i];
  }
  if (res.action === 'closed') {
    res.prEventType = res.merged ? 'merged' : 'closed';
  } else {
    res.prEventType = res.action as any;
  }
  return res;
}

export const prEventsPollStore = poll<{ 'pullRequestEvents': FilteredEvent }, RawSamplingFirstMessage>('sampling', req => sampling(req, process), {
  pullRequestEvents: {
    samplingRate: 1,
    filter: PR_EVENTS_POLL_CONFIG.map(config => config.path),
    eventType: 'PullRequestEvent',
    returnType: 'list',
  } as SamplingRequest,
});
