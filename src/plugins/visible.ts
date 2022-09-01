import { InjectionKey, Plugin, readonly, Ref } from "vue";
import { useThrottleToggle } from "@/components/hooks/throttle-toggle";
import { createDebugLogger } from "@/utils/debug";

export const SYMBOL_VISIBLE: InjectionKey<Readonly<Ref<boolean>>> = Symbol('visible');
export const SYMBOL_VISIBLE_INSTANT: InjectionKey<Readonly<Ref<boolean>>> = Symbol('visible_instant');
export const VISIBLE_THROTTLE = 5000;

function getDocumentVisibilityState() {
  if (import.meta.env.SSR) {
    return true;
  } else {
    return document.visibilityState === 'visible';
  }
}

interface VisiblePluginOptions {
  throttle: number;
  injectionKey: InjectionKey<Readonly<Ref<boolean>>>;
}

export const visible = ({ throttle, injectionKey }: VisiblePluginOptions): Plugin => (app) => {
  const log = createDebugLogger(injectionKey.description ?? 'visible');

  log('init', throttle);
  const { result: visible, toggle, throttleToggle } = useThrottleToggle(getDocumentVisibilityState(), throttle);
  app.provide(injectionKey, readonly(visible));

  if (!import.meta.env.SSR) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        toggle(true);
      } else {
        throttleToggle(false);
      }
    });
  }
};
