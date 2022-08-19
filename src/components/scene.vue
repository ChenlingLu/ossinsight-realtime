<template>
  <div class="container" ref="container">
    <canvas class="scene" ref="canvas" />
    <CSSElements />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { useEvents } from "@/store";
import { prEventsPollStore, process } from "@/store/poll";
import { useActive } from "./hooks/lifecycle";
import { map } from "rxjs";
import { useEngine, useEngineCssElements } from "@/components/hooks/engine";

const active = useActive();

const canvas = ref<HTMLCanvasElement>();
const container = ref<HTMLElement>();
const engineRef = useEngine(canvas, container);

const usePREvents = prEventsPollStore('pullRequestEvents');
const prEvents = usePREvents();
const events = useEvents();

const CSSElements = useEngineCssElements(engineRef);

onMounted(() => {
  events.reload();
});

watchEffect(() => {
  const engine = engineRef.value;
  const newEvents = events.data;
  if (engine && newEvents) {
    engine.setTotal(newEvents);
  }
});

watchEffect((onCleanup) => {
  const engine = engineRef.value;
  if (events.ready && active.value && engine) {
    const subscription = prEvents.stream
        .pipe(map(process))
        .subscribe(event => engine.addBrick(event));
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