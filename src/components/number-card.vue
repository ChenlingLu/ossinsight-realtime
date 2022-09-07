<template>
  <div class="number-card" :class="{ small: size.down('xs') }">
    <div class="number-card-bg" :class="`number-card-bg-c${props.colorStart}-c${props.colorStop}`" />
    <flex class="number-card-content"
          :direction="size.down('xs') ? 'row' : 'column'"
          :align="size.down('xs') ? 'center' : 'flex-start'"
    >
      <flex class="number-card-content-title" justify="center" align="flex-start">
        {{ props.title }}
      </flex>
      <flex class="number-card-content-value" align="center" :direction="size.down('xs') ? 'row-reverse' : 'row'" gap="8px">
        <dot :color="`var(--c${props.colorStart})`" />
        <animated-number :value="props.value" comma />
      </flex>
    </flex>
  </div>
</template>
<script lang="ts" setup>
import Flex from "@/components/ui/flex.vue";
import Dot from "@/components/ui/dot.vue";
import AnimatedNumber from '@/components/ui/animated-number';
import { useSize } from "@/store";

const props = defineProps<{
  title: string
  value: number
  colorStart: number | string,
  colorStop: number | string,
}>();

const size = useSize();
</script>
<style lang="less" scoped>

@border-radius: 6px;
@padding: 3px;

.number-card {
  position: relative;
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  padding: @padding;
  background: transparent;
  border-radius: @border-radius;
  overflow: hidden;

  &-bg {
    opacity: 0.2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    &-c2-c7 {
      background: linear-gradient(95.09deg, var(--c2) 1.97%, var(--c7) 94.72%);
    }

    &-c1-c6 {
      background: linear-gradient(95.09deg, var(--c1) 1.97%, var(--c6) 94.72%);
    }

    &-c7-c5 {
      background: linear-gradient(95.09deg, var(--c7) 1.97%, var(--c6) 94.72%);
    }
  }

  &-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: white;
    border-radius: @border-radius - @padding;
    align-items: flex-start;
    z-index: 1;
    padding: 8px 12px;

    &-title {
      text-align: left;
      width: 100%;
      font-size: 12px;
      flex: unset;
      color: var(--text-secondary);
      line-height: 1;
    }

    &-value {
      flex: unset;
      color: black;
      font-size: 17px;
      font-weight: bold;
      font-family: monospace;
      line-height: 1;
      white-space: nowrap;
    }
  }

  &:not(.small) {
    min-height: 76px;
    .number-card-content {
      // why need this on safari?
      min-height: 70px;

      &-title {
        flex: 1;
        height: 100%;
      }
      &-value {
        flex: 1;
        height: 100%;
      }
    }
  }
}

</style>