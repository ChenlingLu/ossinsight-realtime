<template>
  <div class="flexbox">
    <slot />
  </div>
</template>
<script lang="ts">
import { CSSProperties, PropType } from "vue";

export default {
  props: {
    direction: {
      type: String as PropType<CSSProperties['flex-direction']>,
      default: 'column',
    },
    align: {
      type: String as PropType<CSSProperties['align-items']>,
      default: 'center',
    },
    justify: {
      type: String as PropType<CSSProperties['justify-content']>,
      default: 'flex-start',
    },
    wrap: {
      type: String as PropType<CSSProperties['flex-wrap']>,
      default: 'nowrap',
    },
  },
};
</script>
<style scoped>
.flexbox {
  display: flex;
  flex-direction: v-bind(direction);
  align-items: v-bind(align);
  justify-content: v-bind(justify);
  flex-wrap: v-bind(wrap);
}
</style>