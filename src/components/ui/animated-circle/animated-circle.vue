<template>
  <div class="coordinator">
    <div class="animated-circle"
         :style="{ backgroundColor: color, width: size, height: size, transform: `translate(${offset.x}px, ${offset.y}px)` }" />
    <div class="bubble-container" :style="{ transform: `translate(${offset.x}px, ${offset.y}px)` }">
      <transition-group
          @enter="onInEnter"
          @leave="onLeave"
          :css="false"
      >
        <div
            class="bubble"
            v-for="bubble in bubblesIn"
            :key="bubble.key"
            :style="{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: color,
            }"
            :data-target-x="bubble.to.x"
            :data-target-y="bubble.to.y"
            :data-key="bubble.key"
        />
      </transition-group>
      <transition-group
          @enter="onOutEnter"
          @leave="onLeave"
          :css="false"
      >
        <div
            class="bubble"
            v-for="bubble in bubblesOut"
            :key="bubble.key"
            :style="{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: color,
            }"
            :data-target-x="bubble.to.x"
            :data-target-y="bubble.to.y"
            :data-key="bubble.key"
        />
      </transition-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Property } from "csstype";
import { useBrownianMotion } from "@/components/hooks/brownian-motion";
import { reactive, ref, watch } from "vue";
import { useActive } from "@/components/hooks/lifecycle";
import gsap from 'gsap';
import { ac } from "vitest/dist/global-74489cc9";

const props = defineProps<{
  color: Property.Color
  size: Property.Width
}>();

const container = ref<HTMLElement>();

const { offset, start } = useBrownianMotion();
const active = useActive(0);

const bubblesIn = reactive<{
  key: number
  from: { x: number, y: number }
  pass: { x: number, y: number }
  to: { x: number, y: number }
  size: number
}[]>([]);

const bubblesOut = reactive<{
  key: number
  from: { x: number, y: number }
  pass: { x: number, y: number }
  to: { x: number, y: number }
  size: number
}[]>([])

watch(active, active => {
  if (active) {
    start();
  } else {
    stop();
  }
});

let key = 0;

defineExpose({
  in(count: number) {
    if (!active.value) {
      return;
    }
    const r = parseInt(props.size || "0") / 2;
    const size = r * 0.5;
    const sr = r + size + 20;
    const pr = r - size / 2;
    const c = -size / 2;

    for (let i = 0; i < count; i++) {
      const theta = 7 / 6 * Math.PI + Math.PI * Math.random() * 2 / 3;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);
      bubblesIn.push({
        key: key++,
        from: {
          x: c + cosTheta * sr,
          y: c + sinTheta * sr,
        },
        pass: {
          x: c + cosTheta * pr,
          y: c + sinTheta * pr,
        },
        to: {
          x: c,
          y: c,
        },
        size: size,
      });
    }
  },
  out(count: number) {
    if (!active.value) {
      return;
    }
    const r = parseInt(props.size || "0") / 2;
    const size = r * 0.5;
    const sr = r + size + 20;
    const pr = r - size / 2;
    const c = -size / 2;

    for (let i = 0; i < count; i++) {
      const theta = 1 / 6 * Math.PI  + Math.PI * Math.random() * 2 / 3;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);
      bubblesIn.push({
        key: key++,
        to: {
          x: c + cosTheta * sr,
          y: c + sinTheta * sr,
        },
        pass: {
          x: c + cosTheta * pr,
          y: c + sinTheta * pr,
        },
        from: {
          x: c,
          y: c,
        },
        size: size,
      });
    }
  }
});

const onInEnter = (e: HTMLElement, done: () => void) => {
  const { key } = e.dataset;
  if (!key) {
    done();
    return;
  }
  const bubble = bubblesIn.find(bubble => bubble.key === parseInt(key));
  if (!bubble) {
    done();
    return;
  }

  const tl = gsap.timeline();
  gsap.set(e, {
    x: bubble.from.x,
    y: bubble.from.y,
    scale: 0,
  });
  tl.delay(Math.random());
  tl.to(e, {
    opacity: 1,
    x: bubble.pass.x,
    y: bubble.pass.y,
    scale: 1,
    duration: 2 + .500 * Math.random(),
    ease: 'power2.out',
  });
  tl.to(e, {
    x: bubble.to.x,
    y: bubble.to.y,
    scale: 0,
    opacity: 0,
    duration: 4,
    onComplete: () => {
      done();
      bubblesIn.splice(bubblesIn.indexOf(bubble), 1);
    },
  });
};


const onOutEnter = (e: HTMLElement, done: () => void) => {
  const { key } = e.dataset;
  if (!key) {
    done();
    return;
  }
  const bubble = bubblesIn.find(bubble => bubble.key === parseInt(key));
  if (!bubble) {
    done();
    return;
  }

  const tl = gsap.timeline();
  gsap.set(e, {
    x: bubble.from.x,
    y: bubble.from.y,
    scale: 1,
    opacity: 1,
  });
  tl.delay(Math.random());
  tl.to(e, {
    x: bubble.pass.x,
    y: bubble.pass.y,
    duration: 4,
  });
  tl.to(e, {
    x: bubble.to.x,
    y: bubble.to.y,
    duration: 2 + .500 * Math.random(),
    scale: 0,
    opacity: 0,
    ease: 'power2.out',
    onComplete: () => {
      done();
      bubblesIn.splice(bubblesIn.indexOf(bubble), 1);
    },
  });
};

const onLeave = (_: HTMLElement, done: () => void) => {
  done();
};

</script>
<style scoped>
.coordinator {
  position: relative;
}

.animated-circle, .bubble {
  border-radius: 50%;
  transform-origin: center center;
}

.bubble-container {
  position: absolute;
  width: 100%;
  left: 50%;
  top: 50%;
}

.bubble {
  position: absolute;
  top: 0;
  left: 0;
  transform: initial;
  opacity: 0;
  scale: 0;
}
</style>