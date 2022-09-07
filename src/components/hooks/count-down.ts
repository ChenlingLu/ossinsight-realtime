import { ref, watch, WatchSource } from "vue";

export function useContinueCountDown(seconds: WatchSource<number>) {
  const second = ref(0);

  watch(seconds, (seconds, _, onCleanup) => {
    second.value = seconds - 1;
    const handle = setInterval(() => {
      if (second.value === 0) {
        second.value = seconds - 1;
      }
      second.value -= 1;
    }, 1000);
    onCleanup(() => clearInterval(handle));
  }, { immediate: true });

  return second;
}
