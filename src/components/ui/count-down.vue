<template>
  <svg :style="{ width: size, height: size }" width="200" height="200" viewBox="0 0 200 200">
    <circle r="70" cx="100" cy="100" />
    <circle class="bar" r="70" cx="100" cy="100" pathLength="100" stroke-dasharray="100" :style="{strokeDashoffset: `${percent * 100}px`}" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { useContinueCountDown } from "@/components/hooks/count-down";

const props = defineProps<{
  duration: number, // seconds
  size: number | string,
}>();

const second = useContinueCountDown(() => props.duration);

const percent = computed(() => second.value / (props.duration - 1));

const emits = defineEmits<{ (e: 'tick'): void }>();

watch(second, second => {
  if (second === 0) {
    emits('tick');
  }
});

</script>

<style scoped>
circle {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear;
  stroke: var(--border);
  stroke-width: 30;
  fill: transparent;
}

.bar {
  stroke: var(--c3);
}

</style>