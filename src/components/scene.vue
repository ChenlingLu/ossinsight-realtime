<template>
  <div class="container" ref="container">
    <canvas class="scene" ref="canvas" />
    <Tooltip ref="tooltip" :container="tooltipContainer" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { DemoEngine } from "../demo";
import Tooltip from "./tooltip.vue";
import { loop, sampling } from "../api/poll";

const container = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const tooltipContainer = ref<HTMLElement>();
const tooltip = ref<Tooltip>();
const engineRef = ref<DemoEngine>();

onMounted(async () => {
  const engine = engineRef.value = new DemoEngine(window, canvas.value!, container.value!);

  engine.setup();
  await engine.init();

  tooltipContainer.value = engine.tooltip!.element;
  engine.tooltip!.update = tooltip.value!.update;

  sampling({
    samplingRate: 1,
  }).forEach(event => engine.addBrick(event))
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