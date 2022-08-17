import { ref, Ref, watchEffect } from "vue";

export function isVisible(document: Document): Ref<boolean> {
  const inView = ref(document.visibilityState === 'visible');

  watchEffect((onCleanup) => {
    const handleVisibilityChange = () => {
      inView.value = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    onCleanup(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });
  });

  return inView;
}