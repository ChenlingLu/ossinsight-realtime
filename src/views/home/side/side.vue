<template>
  <flex class="container">
    <status-card
        v-bind="summary"
        :time="(new Date()).getUTCFullYear()"
    />
    <template v-if="size.height >= 420">
      <divider style="margin: 8px 2px" />
      <events-player />
      <divider />
    </template>
    <template v-else>
      <flex-spacer />
    </template>
    <side-footer />
  </flex>
</template>
<script setup lang="ts">
import { reactive, watch, watchEffect } from "vue";
import { prEventsPollStore } from "@/store/poll";
import { useActive } from "@/components/hooks/lifecycle";
import Flex from "@/components/ui/flex.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";
import EventsPlayer from "@/components/events-player.vue";
import Divider from "@/components/ui/divider.vue";
import { useSize } from "@/store";
import StatusCard from "@/components/status-card/StatusCard.vue";
import SideFooter from "@/components/side-footer.vue";

const usePrEvents = prEventsPollStore('pullRequestEvents');

const active = useActive();
const prEvents = usePrEvents();

const size = useSize();

const summary = reactive({
  developers: 0,
  repositories: 0,
  merged: 0,
  opened: 0,
  closed: 0,
  additions: 0,
  deletions: 0,
});

function mergeCount(map: Record<string, string>) {
  return Object.values(map).reduce((p, c) => p + parseInt(c), 0);
}

watch(prEvents.firstMessage, fm => {
  if (fm) {
    summary.developers = parseInt(fm.devMap.total);
    summary.merged = mergeCount(fm.mergeMap);
    summary.opened = mergeCount(fm.openMap);
  }
})

watchEffect((onCleanup) => {
  if (active.value) {
    const subscription = prEvents.stream.subscribe((ev) => {
      if (ev.isDevYear) {
        summary.developers++;
      }
      switch (ev.prEventType) {
        case 'merged':
          summary.merged++;
          summary.additions += parseInt(ev.additions);
          summary.deletions += parseInt(ev.deletions);
          break;
        case 'opened':
          summary.opened++;
          break;
        case 'closed':
          summary.closed++;
          break;
      }
    });
    onCleanup(() => subscription.unsubscribe());
  }
});

</script>
<style scoped lang="less">
.container {
  height: 100%;
  height: -webkit-fill-available;
  box-sizing: border-box;
  margin: 0 16px;
}
</style>