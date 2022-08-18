<template>
  <ul class="list" :ref="elRef">
    <slot />
  </ul>
</template>
<script lang="ts">
import { PropType } from "vue";

export default {
  inheritAttrs: true,
  props: {
    elRef: {
      type: Function as PropType<(el: HTMLElement) => void>,
      required: false,
    },
  },
};
</script>
<style lang="less" scoped>
.list {
  display: block;
  list-style: none;
  margin: 0;
  box-sizing: border-box;
  padding: 0;
}
</style>