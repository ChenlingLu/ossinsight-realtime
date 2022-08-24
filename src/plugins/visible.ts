import { Plugin, readonly } from "vue";
import { useThrottleToggle } from "@/components/hooks/throttle-toggle";
import { createDebugLogger } from "@/utils/debug";

export const SYMBOL_VISIBLE = Symbol('visible');
export const VISIBLE_THROTTLE = 5000;

function getDocumentVisibilityState() {
  if (import.meta.env.SSR) {
    return true;
  } else {
    return document.visibilityState === 'visible';
  }
}

export const visible: Plugin = (app, options = VISIBLE_THROTTLE) => {
  const log = createDebugLogger('visible');
  const { result: visible, toggle, throttleToggle } = useThrottleToggle(getDocumentVisibilityState(), options);
  app.provide(SYMBOL_VISIBLE, readonly(visible));

  if (!import.meta.env.SSR) {
    document.addEventListener('visibilitychange', () => {
      log(document.visibilityState);
      if (document.visibilityState === 'visible') {
        toggle(true);
      } else {
        throttleToggle(false);
      }
    });
  }
};