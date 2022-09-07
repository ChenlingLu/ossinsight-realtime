<template>
  <div class="container" ref="container">
    <canvas class="scene" ref="canvas" />
    <CSSElements />
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, watchEffect } from "vue";
import { prEventsPollStore } from "@/store/poll";
import { useActive } from "@/components/hooks/lifecycle";
import { useEngine, useEngineCssElements } from "@/components/hooks/engine";
import { RawData } from "@/api/total";
import { RawSamplingFirstMessage } from "@/api/poll";
import { createDebugLogger } from "@/utils/debug";
import stats from "@/engine/debug";

const active = useActive();
const activeInstant = useActive(0);

const canvas = ref<HTMLCanvasElement>();
const container = ref<HTMLElement>();
const engineRef = useEngine(canvas, container);

const processFirstMessage = (firstMessage?: RawSamplingFirstMessage): RawData[] => {
  if (!firstMessage) {
    return [];
  }
  const dates = Object.keys(firstMessage.eventMap);
  return dates.map(date => ({
    event_day: date,
    events: parseInt(firstMessage.eventMap[date]),
    opened: parseInt(firstMessage.openMap[date]),
    merged: parseInt(firstMessage.mergeMap[date]),
    developers: parseInt(firstMessage.devMap[date]),
  }));
};

const usePREvents = prEventsPollStore('pullRequestEvents');
const prEvents = usePREvents();
const events = ref<RawData[]>(processFirstMessage(prEvents.firstMessage.value));

const { CSSElements, tooltip, today: todayHistory } = useEngineCssElements(engineRef);

watchEffect(() => {
  const engine = engineRef.value;
  const ev = events.value;
  if (engine && ev) {
    engine.setTotal(ev);
  }
});

watchEffect((onCleanup) => {
  if (stats) {
    document.body.append(stats.dom);
    onCleanup(() => {
      if (stats) {
        document.body.removeChild(stats.dom);
      }
    })
  }
})

watch(activeInstant, active => {
  if (active) {
    engineRef.value?.start();
  } else {
    engineRef.value?.stop();
  }
})

const today = reactive({
  events: 0,
  developers: 0,
  merged: 0,
  opened: 0,
})
const log = createDebugLogger('scene');

watch(prEvents.firstMessage, firstMessage => {
  if (firstMessage) {
    events.value = processFirstMessage(firstMessage)
  }
})

watchEffect((onCleanup) => {
  const engine = engineRef.value;
  if (active.value && engine) {
    log('start subscription');
    const subscription = prEvents.stream
        .subscribe(event => engine.addBrick(event, () => {
          today.events++;
          switch (event.prEventType) {
            case 'opened':
              today.opened++;
              break;
            case 'merged':
              today.merged++;
              break
          }
          if (event.isDevDay) {
            today.developers++;
          }
        }));
    onCleanup(() => {
      subscription.unsubscribe();
      log('dispose subscription');
    });
  }
});

watch(todayHistory, () => {
  today.events = 0;
  today.developers = 0;
  today.merged = 0;
  today.opened = 0;
});

watchEffect(() => {
  const engine = engineRef.value;
  if (engine) {
    if (tooltip.props.isToday) {
      tooltip.props.value = todayHistory.events + today.events;
      tooltip.props.merged = todayHistory.merged + today.merged;
      tooltip.props.developers = todayHistory.developers + today.developers;
      tooltip.props.opened = todayHistory.opened + today.opened;
    }
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