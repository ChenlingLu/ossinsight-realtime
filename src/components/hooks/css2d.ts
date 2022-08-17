import { ComponentOptions, h, reactive, ref, shallowReactive, toRaw, VNode, watch } from "vue";


export function useCSS2DObject<Props extends object>(Component: ComponentOptions<Props & { container?: HTMLElement }>, initialProps: Props) {
  const container = ref<HTMLElement>();
  const props = reactive<Props>({ ...initialProps });
  const vnode = ref<VNode>(h(Component, initialProps));

  watch([() => props, container], ([props, container]) => {
    const newProps = { container, ...(props as Props) }
    vnode.value = h(Component, newProps);
  }, { immediate: false, deep: true });

  return {
    container,
    props,
    vnode,
  }
}