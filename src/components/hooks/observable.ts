import { Observable } from "rxjs";
import { isVisible } from "./visible";
import { watch, WatchSource } from "vue";


declare type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : T[K] extends object ? Immediate extends true ? T[K] | undefined : T[K] : never;
};

type Subscribe<T> = ((value: T) => void);

export function subscribeOnVisible<T, S extends WatchSource[]>(getObservable: () => Observable<T>, cb: (...source: MapSources<S, false>) => Subscribe<T> | void, ...source: S) {
  const visible = isVisible(document);

  watch([getObservable, visible, ...source] as const, ([observable, visible, ...source], _, onCleanup) => {
    if (visible) {
      const sub = cb(...source);
      if (sub) {
        const subscription = observable.subscribe(sub);
        onCleanup(() => {
          subscription.unsubscribe();
        });
      }
    }
  });
}