<template>
  <div class="container" ref="container">
    <canvas class="scene" ref="canvas" />
    <CSSObjects />
  </div>
</template>
<script setup lang="ts">
import { Event } from "three";
import { onMounted, ref, watch } from "vue";
import { DemoEngine } from "../demo";
import Tooltip from "./tooltip.vue";
import Numbers from "./numbers.vue";
import { isVisible } from "./hooks/visible";
import { useApi, useSampling } from "./hooks/api";
import { getTotal } from "../api/total";
import { useCSS2DObject } from "./hooks/css2d";
import { makeVNodesRenderer } from "./vnodes";

const container = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const engineRef = ref<DemoEngine>();
const visible = isVisible(document);
const { stream: eventStream, start: startEventStream } = useSampling(visible);
const { data: total } = useApi(getTotal);

const tooltip = useCSS2DObject(Tooltip, { text: '' });
const numbers = useCSS2DObject(Numbers, { text: '' });

const CSSObjects = makeVNodesRenderer([tooltip.vnode, numbers.vnode])

onMounted(async () => {
  const engine = new DemoEngine(canvas.value!.ownerDocument.defaultView as Window, canvas.value!, container.value!);
  engine.setup();
  engineRef.value = engine;
});

watch(engineRef, (engine, _, onCleanup) => {
  if (engine) {
    tooltip.container.value = engine.tooltip!.element;
    numbers.container.value = engine.numbers!.element;

    const tooltipUpdateHandler = (event: Event) => {
      tooltip.props.text = event.value;
    };

    const numbersUpdateHandler = (event: Event) => {
      numbers.props.text = event.value;
    };

    engine.addEventListener('update:tooltip', tooltipUpdateHandler);
    engine.addEventListener('update:current-number', numbersUpdateHandler);

    onCleanup(() => {
      engine.removeEventListener('update:tooltip', tooltipUpdateHandler);
      engine.removeEventListener('update:current-number', numbersUpdateHandler);
      engine.dispose();
    });
  }
});

import.meta.hot?.on('vite:beforeUpdate', () => {
  engineRef.value = undefined;
})

watch([engineRef, () => total.response] as const, ([engine, resp]) => {
  if (engine && resp) {
    engine.setTotal(resp);
  }
});

watch([engineRef, eventStream], ([engine, stream], _, onCleanup) => {
  if (engine && stream) {
    const subscription = stream.subscribe(event => engine.addBrick(event));
    startEventStream();
    onCleanup(() => subscription.unsubscribe());
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