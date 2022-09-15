<template>
  <div class="coordinator">
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
    <div ref="bubble" class="animated-circle" />
  </div>
</template>
<script lang="ts" setup>
import type { Property } from "csstype";
import { useBrownianMotion } from "@/components/hooks/brownian-motion";
import { reactive, ref, watch } from "vue";
import { useActive } from "@/components/hooks/lifecycle";
import gsap from 'gsap';
import { arc, random } from "@/components/ui/animated-circle/util";

gsap.ticker.fps(60);

const props = defineProps<{
  color: Property.Color
  size: number
}>();

const container = ref<HTMLElement>();

const { offset, start } = useBrownianMotion();
const active = useActive(0);
const bubble = ref<HTMLElement>();

watch(bubble, (bubble, _, onCleanup) => {
  if (bubble) {
    onCleanup(watch(() => props.color, color => {
      gsap.set(bubble, {
        backgroundColor: color,
      });
    }, { immediate: true }));

    onCleanup(watch(() => props.size, (size, prev) => {
      gsap.to(bubble, {
        width: size,
        height: size,
        duration: 1,
        ease: 'power3.inOut',
      });
    }, { immediate: true }));

    onCleanup(watch(offset, offset => {
      gsap.set(bubble, {
        x: offset.x,
        y: offset.y,
      });
    }, { immediate: true }));

    const randomRadius = () => `${random(43, 57)}% ${random(43, 57)}%`;
    const cache = ['50% 50%', '50% 50%', '50% 50%', '50% 50%', 0];
    let cleanup = false;

    gsap.set(bubble, {
      borderBottomRightRadius: cache[0],
      borderBottomLeftRadius: cache[1],
      borderTopRightRadius: cache[2],
      borderTopLeftRadius: cache[3],
      duration: 0,
    });

    const runBubbleEffect = (key: keyof gsap.CSSProperties, i: number) => {
      const run = () => {
        if (cleanup) {
          return;
        }
        gsap.from(bubble, {
          [key]: cache[i],
        });
        gsap.to(bubble, {
          [key]: cache[i] = randomRadius(),
          duration: random(6, 10),
          ease: 'power3.inOut',
          onComplete: run,
        });
      };
      run();
    };

    runBubbleEffect('borderTopLeftRadius', 0);
    runBubbleEffect('borderTopRightRadius', 1);
    runBubbleEffect('borderBottomLeftRadius', 2);
    runBubbleEffect('borderBottomRightRadius', 3);
    onCleanup(() => cleanup = true);
  }
});

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
}[]>([]);

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
    const r = props.size / 2;
    const size = r * 0.5;
    const sr = r + size + 20;
    const pr = r - size - 4;
    const c = -size / 2;

    for (let i = 0; i < count; i++) {
      const theta = arc(random(210, 330));
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
    const r = props.size / 2;
    const size = r * 0.5;
    const sr = r + size + 20;
    const pr = r - size - 4;
    const c = -size / 2;

    for (let i = 0; i < count; i++) {
      const theta = arc(random(30, 150));
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
  },
});

const onInEnter = (e: Element, done: () => void) => {
  const { key } = (e as HTMLElement).dataset;
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
  tl.delay(random(0, 1));
  tl.to(e, {
    opacity: 1,
    x: bubble.pass.x,
    y: bubble.pass.y,
    scale: 1,
    duration: random(2, 4),
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


const onOutEnter = (e: Element, done: () => void) => {
  const { key } = (e as HTMLElement).dataset;
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
  tl.delay(random(0, 1));
  tl.to(e, {
    x: bubble.pass.x,
    y: bubble.pass.y,
    duration: 4,
  });
  tl.to(e, {
    x: bubble.to.x,
    y: bubble.to.y,
    duration: random(2, 4),
    scale: 0,
    opacity: 0,
    ease: 'power2.out',
    onComplete: () => {
      done();
      bubblesIn.splice(bubblesIn.indexOf(bubble), 1);
    },
  });
};

const onLeave = (_: Element, done: () => void) => {
  done();
};

</script>
<style scoped>
.coordinator {
  position: relative;
}

.animated-circle {
  transform-origin: center center;
  box-shadow: 2px -2px 6px white inset, -4px 4px 15px rgba(0,0,0,.2);
  z-index: 1;
}

.animated-circle:before {
  position: absolute;
  content: ' ';
  display: block;
  width: 20%;
  height: 20%;
  right: calc(20% + 2px);
  top: calc(20% - 2px);
  background: white;
  border-radius: 51% 49% 48% 52% / 62% 44% 56% 38%;
  z-index: 1;
  opacity: 0.5;
}

.animated-circle:after {
  position: absolute;
  content: ' ';
  display: block;
  width: 10%;
  height: 10%;
  right: calc(10% + 2px);
  top: calc(40% - 2px);
  background: white;
  border-radius: 51% 49% 48% 52% / 62% 44% 56% 38%;
  z-index: 1;
  opacity: 0.8;
}

.bubble {
  border-radius: 50%;
  transform-origin: center center;
  z-index: 0;
}

.bubble-container {
  position: absolute;
  width: 100%;
  left: 50%;
  top: 50%;
  z-index: 0;
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