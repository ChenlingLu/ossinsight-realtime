import { defineStore } from "pinia";
import { cancellableFetch } from "@/api/base";

type ApiMap = {
  'live-time-base-information-hourly': {
    additions: number
    closed_prs: number
    deletions: number
    developers: number
    merged_prs: number
    opened_prs: number
    repos: number
  }
  'live-time-top-developers-by-prs-daily': {
    actor_id: number
    actor_login: string
    closed_prs: number
    merged_prs: number
    opened_prs: number
    total_prs: number
  }
  'live-time-top-repos-by-prs-daily': {
    closed_prs: number
    merged_prs: number
    opened_prs: number
    repo_id: number
    repo_name: string
    total_prs: number
  }
}

type ApiState<T> = {
  loading: boolean
  data: {
    data: T[]
    requestedAt: string
    finishedAt: string
    spent: number
    sql: string
  } | undefined
  error: unknown | undefined
  canceller: ((reason?: any) => void) | undefined
}

export function useApiDataStore<K extends keyof ApiMap>(query: K) {
  const useApiData = defineStore(`q/${query}`, {
    state: () => ({
      loading: false,
      data: undefined,
      error: undefined,
      canceller: undefined,
    } as ApiState<ApiMap[K]>),
    getters: {
      initialized: state => !!(state.data || state.error || state.loading),
      finishedAt: state => {
        if (state.data) {
          return new Date(state.data.finishedAt);
        } else {
          return undefined;
        }
      },
      single: state => state.data?.data[0],
    },
    actions: {
      reload() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        this.error = undefined;
        const promise = cancellableFetch(`https://api.ossinsight.io/q/${query}`);
        this.canceller = promise.cancel;
        promise
          .then(res => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error(res.statusText);
            }
          })
          .then(data => {
            this.data = data;
          })
          .catch(error => {
            this.error = error;
          })
          .finally(() => {
            this.loading = false;
            this.canceller = undefined;
          });
      },
      cancel() {
        this.canceller?.();
      },
    },
  });

  const apiData = useApiData();
  if (!apiData.initialized) {
    apiData.reload();
  }
  return apiData;
}
