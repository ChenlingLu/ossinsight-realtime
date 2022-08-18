import { onBeforeUnmount, onMounted, ref, Ref, watchEffect } from "vue";

export function isVisible(document: Document): Ref<boolean> {
  const inView = ref(document.visibilityState === 'visible');
  const handleVisibilityChange = () => {
    inView.value = document.visibilityState === 'visible';
  };

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
  })

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  })

  return inView;
}
