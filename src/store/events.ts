import { acceptHMRUpdate, defineStore } from "pinia";
import { RawData } from "@/api/total";
import { Cancelable, cancellableFetch } from "@/api/base";
import { markRaw } from "vue";

export const useEvents = defineStore('events', {
  state: () => ({
    loading: false,
    data: markRaw([] as RawData[]),
    error: undefined as (unknown | undefined),
    cancellable: undefined as Cancelable | undefined,
    ready: false,
  }),
  getters: {
    total: (state) => {
      return state.data.reduce((total, item) => total + item.events, 0);
    },
  },
  actions: {
    async reload() {
      if (this.cancellable) {
        this.cancellable.cancel('reload');
        this.cancellable = undefined;
      }
      this.loading = true;
      this.ready = false;
      this.error = undefined;
      try {
        const promise = cancellableFetch('https://api.ossinsight.io/q/events-daily');
        this.cancellable = markRaw(promise);
        this.data = markRaw(await promise.then(data => data.json()).then(data => data.data));
        this.ready = true;
      } catch (e) {
        this.error = e;
      } finally {
        this.loading = false;
        this.cancellable = undefined;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEvents, import.meta.hot));
}
