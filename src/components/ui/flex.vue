<template>
  <div class="flexbox"
       :class="{
          info,
          [`flexbox-${props.direction ?? 'column'}`]: true,
          'gap': !!props.gap
       }"
       :style="{
          flexDirection: props.direction || 'column',
          alignItems: props.align || 'center',
          justifyContent: props.justify || 'flex-start',
          flexWrap: props.wrap || 'nowrap',
          '--gap': props.gap,
       }">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { CSSProperties } from "vue";

const props = defineProps<{
  direction?: CSSProperties['flex-direction']
  align?: CSSProperties['align-items']
  justify?: CSSProperties['justify-content']
  wrap?: CSSProperties['flex-wrap']
  gap?: CSSProperties['gap']
  info?: boolean
}>();
</script>
<style scoped lang="less">
.flexbox {
  display: flex;
  box-sizing: border-box;

  &-row.gap {
    & > :deep(*) {
      margin-left: var(--gap);
    }
    & > :deep(*:first-child, *:only-child) {
      margin-left: 0;
    }
  }

  &-column.gap {
    & > :deep(*) {
      margin-top: var(--gap);
    }
    & > :deep(*:first-child, *:only-child) {
      margin-top: 0;
    }
  }

  &-row-reverse.gap {
    & > :deep(*) {
      margin-right: var(--gap);
    }
    & > :deep(*:first-child, *:only-child) {
      margin-right: 0;
    }
  }

  &-column-reverse.gap {
    & > :deep(*) {
      margin-bottom: var(--gap);
    }
    & > :deep(*:first-child, *:only-child) {
      margin-bottom: 0;
    }
  }
}


.info {
  width: 100%;
  margin: 8px 0;
}

.info + .info {
  margin-top: 0;
}
</style>