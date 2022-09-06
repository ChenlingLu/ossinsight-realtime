<template>
  <span class="animated-numbers__number-container">
    <span style="visibility: hidden">{{ props.number }}</span>
    <span class="animated-numbers__number" :style="currentStyle">{{ props.number }}</span>
    <span class="animated-numbers__number" style="user-select: none" :style="nextStyle">{{ next }}</span>
  </span>
</template>
<script lang="ts" setup>
import { computed, StyleValue } from "vue";

const props = defineProps<{
  number: number
  state: number // [0 , 1)
}>();

const next = computed(() => (props.number + 1) % 10);

const nextStyle = computed(() => ({
  opacity: Math.max(0, props.state),
  transform: `translateY(${(1 - props.state) * 50}%) rotateX(${(props.state - 1) * 61}deg)`,
} as StyleValue));

const currentStyle = computed(() => ({
  opacity: Math.abs(1 - props.state),
  transform: `translateY(-${(props.state) * 50}%) rotateX(${(props.state) * 61}deg)`,
} as StyleValue));

</script>
<style scoped>
.animated-numbers__number-container {
  display: inline-block;
  position: relative;
}

.animated-numbers__number {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
</style>