<template>
  <div class="container" ref="container">
    <canvas class="scene" ref="canvas" />
    <Tooltip ref="tooltip" :container="tooltipContainer" />
    <Numbers ref="numbers" :container="numbersContainer" />
  </div>
</template>
<script setup lang="ts">
import { Event } from "three";
import { effect, onMounted, ref, watchEffect } from "vue";
import { DemoEngine } from "../demo";
import Tooltip from "./tooltip.vue";
import { sampling } from "../api/poll";
import Numbers from "./numbers.vue";
import { isVisible } from "./hooks/visible";

const container = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const tooltipContainer = ref<HTMLElement>();
const numbersContainer = ref<HTMLElement>();
const tooltip = ref<typeof Tooltip>();
const numbers = ref<typeof Numbers>();
const engineRef = ref<DemoEngine>();
const visible = isVisible(document)

const tooltipUpdateHandler = (event: Event) => {
  tooltip.value?.update(event.value);
};

const numbersUpdateHandler = (event: Event) => {
  numbers.value?.update(event.value);
};

onMounted(async () => {
  const engine = new DemoEngine(window, canvas.value!, container.value!);

  engine.setup();
  await engine.init();

  engineRef.value = engine;
});

watchEffect((onCleanup) => {
  const engine = engineRef.value;

  if (engine) {
    tooltipContainer.value = engine.tooltip!.element;
    numbersContainer.value = engine.numbers!.element;

    engine.addEventListener('update:tooltip', tooltipUpdateHandler);
    engine.addEventListener('update:current-number', numbersUpdateHandler);

    onCleanup(() => {
      engine.removeEventListener('update:tooltip', tooltipUpdateHandler);
      engine.removeEventListener('update:current-number', numbersUpdateHandler);
    });
  }
})

watchEffect((onCleanup) => {
  const engine = engineRef.value;
  if (engine && visible.value) {
    const events = sampling({
      samplingRate: 1,
      filter: ['id', 'type'],
    });
    const subscription = events.source.subscribe(event => engine.addBrick(event));
    onCleanup(() => {
      subscription.unsubscribe();
      events.dispose();
    })
  }
});

</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.scene {
  width: 100%;
  height: 100%;
}
</style>