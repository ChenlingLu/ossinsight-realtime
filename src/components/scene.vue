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
import { useCSS2DObject } from "./hooks/css2d";
import { makeVNodesRenderer } from "./vnodes";
import { useEvents } from "../store";
import { prEventsPollStore, process } from "../store/poll";
import { subscribeOnVisible } from "./hooks/observable";

const container = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const engineRef = ref<DemoEngine>();

const usePREvents = prEventsPollStore('pullRequestEvents');
const prEvents = usePREvents();
const events = useEvents();

const tooltip = useCSS2DObject(Tooltip, { text: '' });
const numbers = useCSS2DObject(Numbers, { text: '' });

const CSSObjects = makeVNodesRenderer([tooltip.vnode, numbers.vnode]);

onMounted(() => {
  events.reload();
});

watch([canvas, container], ([canvas, container]) => {
  if (canvas && container) {
    const window = canvas.ownerDocument.defaultView as Window;
    const engine = new DemoEngine(window, canvas, container);
    engine.setup();
    engineRef.value = engine;
  }
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

watch([engineRef, () => events.events] as const, ([engine, resp]) => {
  if (engine && resp) {
    engine.setTotal(resp);
  }
});

subscribeOnVisible(() => prEvents.stream, (engine) => {
  if (engine) {
    return event => engine.addBrick(process(event));
  }
}, engineRef);
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