<template>
  <div class="flexbox" :class="{ info }">
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

    info: {
      type: Boolean as PropType<boolean>,
      default: false,
    }
  },
};
</script>
<style scoped>
.flexbox {
  display: flex;
  box-sizing: border-box;
  flex-direction: v-bind(direction);
  align-items: v-bind(align);
  justify-content: v-bind(justify);
  flex-wrap: v-bind(wrap);
}

.info {
  width: 100%;
  margin: 8px 0;
}

.info + .info {
  margin-top: 0;
}
</style>