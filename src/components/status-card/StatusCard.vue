<template>
  <flex class="banner">
    <div class="banner-title">
      <AnimatedNumber class="number" :value="developers" comma /> developers collaborated on
      <br />
      <AnimatedNumber class="number" :value="repositories" comma /> repositories
      <b>{{time}}</b>.
    </div>
    <div class="code-info">
      Total code line changes:
      <span class="number addition">
        +<AnimatedNumber :value="additions" comma />
      </span>
      /
      <span class="number deletion">
        -<AnimatedNumber :value="deletions" comma />
      </span>
    </div>
    <flex class="number-cards info" :direction="size.down('xs') ? 'column' : 'row'" gap="4px">
      <number-card title="Opened PRs" :value="opened" color-start="1" color-stop="6" />
      <number-card title="Merged PRs" :value="merged" color-start="7" color-stop="5" />
      <number-card title="Closed PRs" :value="closed" color-start="2" color-stop="7" />
    </flex>
    <slot name="footer" />
  </flex>
</template>
<script lang="ts" setup>

import NumberCard from '@/components/number-card.vue';
import AnimatedNumber from '@/components/ui/animated-number';
import Flex from '@/components/ui/flex.vue';
import { useSize } from "@/store";

const props = defineProps<{
  developers: number
  repositories: number
  opened: number
  merged: number
  closed: number
  additions: number
  deletions: number
  time: string
}>();

const size = useSize();

</script>
<style lang="less" scoped>

.banner {
  width: 100%;
  min-height: 94px;
  box-sizing: border-box;
  position: relative;
  margin: 16px 16px 0;

  a {
    color: unset !important;
    pointer-events: auto;
  }

  &:before {
    display: block;
    content: ' ';
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(95.09deg, #34A352 1.97%, #0085FF 94.72%);
    opacity: 0.15;
    border-radius: 6px;
    pointer-events: none;
  }

  &-title {
    font-size: 18px;
    font-weight: normal;
    text-align: left;
    width: calc(~"100% - 32px");
    margin: 0;
    padding: 8px 16px;
  }

  .code-info {
    font-size: 12px;
    width: calc(~"100% - 32px");
    margin: 0;
    padding: 8px 16px;
  }

  .number {
    font-family: monospace;
    font-weight: bold;

    &.addition {
      color: var(--c1);
    }
    &.deletion {
      color: var(--c2);
    }

  }
}

.number-cards {
  margin: 8px auto;
  width: ~"calc(100% - 16px)";
}
</style>