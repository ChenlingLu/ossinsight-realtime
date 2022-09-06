<template>
  <span class="animated-numbers">
    <transition-group name="numbers">
      <template v-for="{ comma, number, state, key } in array">
        <span class="animated-numbers__comma" v-if="comma" :key="`comma-${key}`">,</span>
        <single-number v-else :number="number" :state="state" :key="`number-${key}`" />
      </template>
    </transition-group>
  </span>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import SingleNumber from "./SingleNumber.vue";

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

function animate(t: number) {
  const delta = (t - ts.value - delay.value)
  if (delta > duration.value) {
    progress.value = 1;
    running.value = false;
    return;
  }

  progress.value = ease(delta / duration.value);
  requestAnimationFrame(animate);
}

function start() {
  running.value = true;
  ts.value = performance.now();
  requestAnimationFrame(animate);
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

.numbers-enter-active,
.numbers-leave-active {
  transition: all 0.25s ease;
  transition-delay: 0.25s;
}

.numbers-move {
  transition: all 0.25s ease;
}

.numbers-enter-from,
.numbers-leave-to {
  position: absolute;
  opacity: 0;
  transform: translateX(-100%);
}
</style>