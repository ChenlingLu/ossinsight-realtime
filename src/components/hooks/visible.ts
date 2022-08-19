import { inject, readonly, ref, Ref } from "vue";
import { SYMBOL_VISIBLE } from "@/plugins/visible";

const TRUE = readonly(ref(true));

export function useVisible(): Readonly<Ref<boolean>> {
  return inject<Readonly<Ref<boolean>>>(SYMBOL_VISIBLE) ?? TRUE;
}
