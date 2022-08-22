<template>
  <div class="container" ref="container">
    <canvas class="scene" ref="canvas" />
    <CSSElements />
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { prEventsPollStore, process } from "@/store/poll";
import { useActive } from "./hooks/lifecycle";
import { map } from "rxjs";
import { useEngine, useEngineCssElements } from "@/components/hooks/engine";
import { RawData } from "@/api/total";
import { RawSamplingFirstMessage } from "@/api/poll";

const active = useActive();

const canvas = ref<HTMLCanvasElement>();
const container = ref<HTMLElement>();
const engineRef = useEngine(canvas, container);

const processFirstMessage = (firstMessage?: RawSamplingFirstMessage) => {
  if (!firstMessage) {
    return [];
  }
  return Object.entries(firstMessage.eventMap).map(([event_day, events]) => ({
    event_day,
    events: parseInt(events),
  }));
};

const usePREvents = prEventsPollStore('pullRequestEvents');
const prEvents = usePREvents();
const events = ref<RawData[]>(processFirstMessage(prEvents.stream.lastFirstMessage));

const CSSElements = useEngineCssElements(engineRef);

watchEffect(() => {
  const engine = engineRef.value;
  const newEvents = events.value;
  if (engine && newEvents) {
    engine.setTotal(newEvents);
  }
});

watchEffect((onCleanup) => {
  const engine = engineRef.value;
  if (active.value && engine) {
    const subscription = prEvents.stream
        .pipe(map(process))
        .subscribe(event => engine.addBrick(event));
    subscription.add(prEvents.firstMessage.subscribe(firstMessage => {
      events.value = processFirstMessage(firstMessage);
    }));
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