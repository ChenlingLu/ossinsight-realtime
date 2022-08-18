import { onBeforeUnmount, onMounted, ref, Ref } from "vue";

export function isVisible(document: Document, throttle = 0): Ref<boolean> {
  const inView = ref(document.visibilityState === 'visible');
  let throttleHandler: ReturnType<typeof setTimeout> | undefined = undefined;
  const handleVisibilityChange = () => {
    const visible = document.visibilityState === 'visible';
    if (visible) {
      clearTimeout(throttleHandler);
      inView.value = true;
    } else {
      if (throttle) {
        throttleHandler = setTimeout(() => {
          inView.value = false;
        }, throttle);
      } else {
        inView.value = false;
      }
    }
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  return inView;
}
