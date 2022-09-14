<template>
  <div class="flexbox"
       ref="el"
       :class="{
          info,
          [`flexbox-${direction ?? 'column'}`]: true,
          'gap': !!gap
       }"
       :style="{
          flexDirection: direction || 'column',
          alignItems: align || 'center',
          justifyContent: justify || 'flex-start',
          flexWrap: wrap || 'nowrap',
          width: fullWidth ? '100%' : undefined,
          height: fullHeight ? '100%' : undefined,
          '--gap': gap,
       }">
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { CSSProperties, ref } from "vue";

const el = ref<HTMLElement | null>(null);

defineExpose({
  el,
});

defineProps<{
  direction?: CSSProperties['flex-direction']
  align?: CSSProperties['align-items']
  justify?: CSSProperties['justify-content']
  wrap?: CSSProperties['flex-wrap']
  gap?: CSSProperties['gap']
  info?: boolean
  fullWidth?: boolean
  fullHeight?: boolean
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

</style>