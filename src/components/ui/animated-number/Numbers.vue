<template>
  <span class="animated-numbers">
    <template v-for="{ comma, number, state, key } in array">
      <span class="animated-numbers__comma" v-if="comma" :key="`comma-${key}`">,</span>
      <single-number v-else :number="number" :state="state" :key="`number-${key}`" />
    </template>
  </span>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import SingleNumber from "./SingleNumber.vue";
import { useAnimationFrame } from "@/components/hooks/animation-frame";

const props = defineProps<{
  value: number;
  comma?: boolean;
  duration?: number
  delay?: number
}>();

function ease(t: number): number {
  return t * t * (3.0 - 2.0 * t);
}

const duration = computed(() => props.duration || 400);
const delay = computed(() => currentValue.value === 0 ? (props.delay || 0) : 0);
const ts = ref(0);
const progress = ref(0);

const currentValue = ref(props.value);
const currentTarget = ref(props.value);
const nextTarget = ref(props.value);
const running = ref(false);

const { start: _start, stop: _stop } = useAnimationFrame((timestamp: number) => {
  const delta = (timestamp - ts.value - delay.value);
  if (delta > duration.value) {
    progress.value = 1;
    stop();
    return;
  }

  progress.value = ease(delta / duration.value);
});

function stop() {
  running.value = false;
  _stop();
}

function start() {
  running.value = true;
  ts.value = performance.now();
  _start();
}

watch(() => props.value, value => {
  if (running.value) {
    nextTarget.value = value;
  } else {
    currentTarget.value = value;
    nextTarget.value = value;
    start();
  }
});

watch(running, running => {
  if (!running) {
    currentValue.value = currentTarget.value;
    progress.value = 0;
    if (currentTarget.value !== nextTarget.value) {
      currentTarget.value = nextTarget.value;
      start();
    }
  }
}, { immediate: true });

const array = computed(() => {
  const res: { comma: boolean, number: number, state: number, key: number }[] = [];
  let state = Math.max(0, Math.min(1, progress.value));
  let value = Math.abs(currentValue.value);
  let target = Math.abs(currentTarget.value);
  let current = state === 1 ? target : state === 0 ? value : (value + (target - value) * state);

  let cnt = 0;

  while (target >= 1) {
    if (props.comma && cnt % 3 === 0 && cnt !== 0) {
      res.push({ comma: true, number: 0, state: 0, key: cnt });
    }
    cnt += 1;

    let valueMag = Math.floor(value % 10);
    let targetMag = Math.floor(target % 10);
    let diff = targetMag >= valueMag ? targetMag - valueMag : (targetMag - valueMag + 10);

    res.push({ comma: false, number: (valueMag + Math.floor(diff * state)) % 10, state: (diff * state) % 1, key: cnt });
    target /= 10;
    value /= 10;
    current /= 10;
  }

  if (res.length === 0) {
    res.push({ comma: false, number: 0, state: 0, key: 1 });
  }
  return res.reverse();
});
</script>
<style scoped>
.animated-numbers {
  display: inline-block;
  position: relative;
}

.animated-numbers__comma {
  display: inline-block;
}
</style>