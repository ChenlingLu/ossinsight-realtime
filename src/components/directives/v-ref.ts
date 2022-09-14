import { Directive, isRef, warn } from "vue";

const vRef: Directive = {
  mounted: (el, binding, vnode) => {
    console.log(el, binding, vnode)
    if (isRef(binding.value)) {
      binding.value = el;
    } else {
      warn(`${binding.value} is not a ref`);
    }
  },
  updated: (el, binding) => {
    if (isRef(binding.value)) {
      binding.value = el;
    } else {
      warn(`${binding.value} is not a ref`);
    }
  },
  unmounted: (el, binding) => {
    if (isRef(binding.value)) {
      binding.value = null;
    } else {
      warn(`${binding.value} is not a ref`);
    }
  },
};

export default vRef;