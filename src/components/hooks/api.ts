import { markRaw, reactive, Ref, ref, shallowReactive, watch, watchEffect } from "vue";
import { GithubEvent, sampling, SamplingRequest } from "../../api/poll";
import { Observable } from "rxjs";

interface ApiResult<T> {
  response: T | undefined;
  loading: boolean;
  error: unknown | undefined;
}

export function useApi<T extends object>(call: () => Promise<T>) {
  const data = shallowReactive<ApiResult<T>>({
    response: undefined,
    loading: false,
    error: undefined,
  });

  const reload = async () => {
    try {
      data.loading = true;
      data.response = markRaw(await call());
    } catch (e) {
      if (typeof e === 'object' && e) {
        data.error = markRaw(e);
      } else {
        data.error = e;
      }
    } finally {
      data.loading = false;
    }
  };
  reload();

  return { data, reload };
}

const DEFAULT_SAMPLING_REQ: SamplingRequest = {
  samplingRate: 1,
  filter: ['id'],
  eventType: 'PullRequestEvent',
};

export function useSampling(condition: Ref<boolean>, initialReq: SamplingRequest = DEFAULT_SAMPLING_REQ) {
  const req = reactive(initialReq);
  const stream = ref<Observable<Partial<GithubEvent>>>();
  const startRef = ref<() => void>(() => {
  });
  const start = () => {
    startRef.value();
  };

  watchEffect((onCleanup) => {
    if (condition.value) {
      const { source, dispose, start } = sampling(req);
      stream.value = source;
      startRef.value = start;
      onCleanup(() => {
        dispose();
        stream.value = undefined;
      });
    }
  });

  return {
    req,
    stream,
    start,
  };
}
