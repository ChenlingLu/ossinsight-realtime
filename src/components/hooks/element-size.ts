import { ref, Ref, watch } from "vue";

type Size = {
  width: number
  height: number
}

export function useElementSize(el: Ref<HTMLElement | undefined>, defaultSize?: Size) {
  const size = ref(defaultSize);
  watch(el, (el, _, onCleanup) => {
    if (!el) {
      return;
    }
    size.value = el.getBoundingClientRect();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(([entry]) => {
        size.value = entry.contentRect;
      });
      ro.observe(el);

      onCleanup(() => {
        ro.disconnect();
        size.value = defaultSize;
      });
    }
  }, { immediate: true });

  return size;
}