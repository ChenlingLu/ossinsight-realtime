<template>
  <span class="dot">
    <span class="ripple" />
  </span>
</template>
<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{ color: string, size?: number }>();

const size = computed(() => `${props.size ?? 8}px`);
</script>
<style scoped lang="less">

.dot {
  display: block;
  position: relative;
  width: v-bind(size);
  height: v-bind(size);
  background: v-bind(color);
  border-radius: 50%;
}

.ripple {
  display: block;
  position: absolute;
  background: v-bind(color);
  border-radius: 50%;
  transform-origin: center center;
  animation-duration: 1.5s;
  animation-play-state: running;
  animation-iteration-count: 9999999;
  animation-timing-function: linear;

  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation-name: animate;
}

@keyframes animate {
  0% {
    opacity: 0.8;
    transform: scale3d(1, 1, 1);
  }
  61% {
    opacity: 0.3;
    transform: scale3d(2, 2, 1);
  }
  100% {
    opacity: 0;
    transform: scale3d(3, 3, 1);
  }
}
</style>