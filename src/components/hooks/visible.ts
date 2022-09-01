import { inject, readonly, ref, Ref } from "vue";
import { SYMBOL_VISIBLE, SYMBOL_VISIBLE_INSTANT } from "@/plugins/visible";

const TRUE = readonly(ref(true));

export function useVisible(): Readonly<Ref<boolean>> {
  return inject(SYMBOL_VISIBLE) ?? TRUE;
}

export function useVisibleInstant(): Readonly<Ref<boolean>> {
  return inject(SYMBOL_VISIBLE_INSTANT) ?? TRUE;
}