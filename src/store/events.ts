import { acceptHMRUpdate, defineStore } from "pinia";
import { RawData } from "../api/total";
import { Cancelable, cancellableFetch } from "../api/base";
import { markRaw } from "vue";

export const useEvents = defineStore('events', {
  state: () => ({
    loading: false,
    events: markRaw([] as RawData[]),
    error: undefined as (unknown | undefined),
    cancellable: undefined as Cancelable | undefined,
  }),
  getters: {
    total: (state) => {
      return state.events.reduce((total, item) => total + item.events, 0);
    }
  },
  actions: {
    async reload() {
      if (this.cancellable) {
        this.cancellable.cancel('reload');
        this.cancellable = undefined;
      }
      this.loading = true;
      this.error = undefined;
      try {
        const promise = cancellableFetch('https://api.ossinsight.io/q/events-daily');
        this.cancellable = markRaw(promise);
        this.events = markRaw(await promise.then(data => data.json()).then(data => data.data));
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
  import.meta.hot.accept(acceptHMRUpdate(useEvents, import.meta.hot))
}
