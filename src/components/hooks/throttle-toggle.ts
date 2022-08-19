import { readonly, ref } from "vue";

export function useThrottleToggle(initial: boolean, throttle?: number) {
  const result = ref(initial);

  let throttleHandle: ReturnType<typeof setTimeout> | undefined = undefined;

  return {
    result: readonly(result),
    throttleToggle: (value: boolean) => {
      if (throttle) {
        clearTimeout(throttleHandle);
        throttleHandle = setTimeout(() => {
          result.value = value;
        }, throttle);
      } else {
        result.value = value;
      }
    },
    toggle: (value: boolean) => {
      if (throttle) {
        clearTimeout(throttleHandle);
        result.value = value;
      }
    },
  };
}