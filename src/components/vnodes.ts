import { Ref, VNode } from "vue";

export function makeVNodesRenderer(vnodes: Ref<VNode>[]): () => VNode[] {
  return () => {
    return vnodes.map(vnode => vnode.value);
  };
}
