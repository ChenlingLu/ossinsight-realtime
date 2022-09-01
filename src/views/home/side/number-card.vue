<template>
  <div class="number-card">
    <div class="number-card-bg" :class="`number-card-bg-c${props.colorStart}-c${props.colorStop}`" />
    <flex class="number-card-content">
      <flex class="number-card-content-title" justify="center">
        {{ props.title }}
      </flex>
      <flex class="number-card-content-value" align="center" direction="row">
        <dot :color="`var(--c${props.colorStart})`" style="margin-right: 8px" />
        {{ props.value.toLocaleString('en') }}
      </flex>
    </flex>
  </div>
</template>
<script lang="ts" setup>
import Flex from "@/components/ui/flex.vue";
import Dot from "@/components/ui/dot.vue";

const props = defineProps<{
  title: string
  value: number
  colorStart: number | string,
  colorStop: number | string,
}>();
</script>
<style lang="less" scoped>

@border-radius: 6px;
@padding: 3px;

.number-card {
  position: relative;
  flex: 1;
  height: 76px;
  padding: @padding;
  background: transparent;
  border-radius: @border-radius;
  overflow: hidden;

  margin-left: 4px;

  &:first-child {
    margin-left: 0;
  }

  &-bg {
    opacity: 0.2;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    &-c3-c7 {
      background: linear-gradient(95.09deg, var(--c3) 1.97%, var(--c7) 94.72%);
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
      font-size: 12px;
      flex: 1;
      color: var(--text-secondary);
    }

    &-value {
      flex: 1;
      color: black;
      font-size: 18px;
      font-weight: bold;
      font-family: monospace;
    }
  }
}

</style>