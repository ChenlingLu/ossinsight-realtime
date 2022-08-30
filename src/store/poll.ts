import { acceptHMRUpdate, defineStore } from "pinia";
import { ConnectionSource, FirstMessage, RawSamplingFirstMessage, sampling, SamplingRequest } from "@/api/poll";
import { markRaw } from "vue";

export interface PollStore<T, F extends FirstMessage> {
  stream: ConnectionSource<T, F>;
}

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
      },
    });

    if (import.meta.hot) {
      import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
    }

    return useStore;
  };
}

export type RawFilteredEvent = [number, string, number, string, string, string]

export interface FilteredEvent {
  'id': number;
  'action': string;
  'pr': number;
  'repoName': string;
  'actorLogin': string;
  'language': string;
}

export function process(raw: RawFilteredEvent): FilteredEvent {
  return {
    'id': raw[0],
    'action': raw[1],
    'pr': raw[2],
    'repoName': raw[3],
    'actorLogin': raw[4],
    'language': raw[5],
  };
}

export const prEventsPollStore = poll<{ 'pullRequestEvents': RawFilteredEvent }, RawSamplingFirstMessage>('sampling', sampling, {
  pullRequestEvents: {
    samplingRate: 1,
    filter: [
      'event.id',
      'event.payload.action',
      'event.payload.pull_request.number',
      'event.repo.name',
      'event.actor.login',
      'event.payload.pull_request.base.repo.language',
      'payload.devDay',
      'payload.devYear',
      'payload.merge',
      'payload.open',
      'payload.pr',
    ],
    eventType: 'PullRequestEvent',
    returnType: 'list',
  } as SamplingRequest,
});
