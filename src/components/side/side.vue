<template>
  <flex class="container">
    <flex class="banner">
      <h2 class="banner-title">
        <span>
          Total <a
            href="https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#pullrequestevent"
            target="_blank">Pull Request Events</a> made by developers {{ (new Date()).getUTCFullYear() }}
        </span>
        <total-card :state="state" :number="number" />
      </h2>
    </flex>
    <flex class="info" direction="row">
      <number-card title="Developers" :value="summary.year.dev" color-start="3" color-stop="7" />
      <number-card title="Opened PRs" :value="summary.year.open" color-start="1" color-stop="6" />
      <number-card title="Merged PRs" :value="summary.year.merge" color-start="7" color-stop="5" />
    </flex>
    <hr class="divider" />
    <flex class="info" direction="row" justify="space-between">
      <h2>
        <PlayButton v-model="play" />
        Real-Time Pull Requests
      </h2>
      <a href="https://ossinsight.io/blog/why-we-choose-tidb-to-support-ossinsight">🤖️ how to make it</a>
    </flex>
    <flex class="info" direction="row" justify="space-between">
      <LangSelect v-model="language" />
      <RepoFilter v-model="repo" style="margin-left: 16px; flex: 1" />
    </flex>
    <event-list :source="prEvents" :language="language" :repo="repo" :play="play" />
    <hr class="divider" />
    <flex class="info" direction="row" justify="center">
      <span style="color: var(--text-secondary); font-size: 12px">Powered by</span>
      &nbsp;
      &nbsp;
      <img src="/logos/tidbcloud.png" alt="TiDB Cloud" height="16" />
      &nbsp;
      &nbsp;
      <img src="/logos/pulsar.png" alt="Pulsar" height="16" />
    </flex>
  </flex>
</template>
<script setup lang="ts">
import Flex from "../ui/flex.vue";
import { computed, reactive, ref, watchEffect } from "vue";
import { prEventsPollStore, process } from "@/store/poll";
import { useActive } from "../hooks/lifecycle";
import { ConnectionState, RawSamplingFirstMessage } from "@/api/poll";
import LangSelect from "../ui/lang-select.vue";
import RepoFilter from "../ui/repo-filter.vue";
import EventList from "../event-list.vue";
import PlayButton from "@/components/ui/play-button.vue";
import NumberCard from "@/components/side/number-card.vue";
import TotalCard from "@/components/side/total-card.vue";
import { map } from "rxjs";

const usePrEvents = prEventsPollStore('pullRequestEvents');

const getEventCount = (firstEventMessage?: RawSamplingFirstMessage) => {
  if (!firstEventMessage) {
    return 0;
  }
  return Object.values(firstEventMessage.eventMap).reduce((a, b) => a + parseInt(b), 0);
};

const active = useActive();
const prEvents = usePrEvents();
const events = ref(getEventCount(prEvents.stream.lastFirstMessage));
const total = ref(0);
const state = ref(ConnectionState.CONNECTING);
const language = ref('Any Language');
const repo = ref('');
const play = ref(true);

const summary = reactive({
  year: {
    dev: 0,
    merge: 0,
    open: 0,
  },
});

prEvents.stream.onStateChange(newState => state.value = newState);

function mergeCount(map: Record<string, string>) {
  return Object.values(map).reduce((p, c) => p + parseInt(c), 0);
}

watchEffect((onCleanup) => {
  if (active.value) {
    const subscription = prEvents.stream.pipe(map(process)).subscribe((ev) => {
      total.value++;
      if (ev.isDevYear) {
        summary.year.dev++;
      }
      switch (ev.prEventType) {
        case 'merged':
          summary.year.merge++;
          break;
        case 'opened':
          summary.year.open++;
          break;
      }
    });
    subscription.add(prEvents.firstMessage.subscribe(fm => {
      events.value = getEventCount(fm);
      total.value = 0;
      summary.year = {
        dev: parseInt(fm.devMap.total),
        merge: mergeCount(fm.mergeMap),
        open: mergeCount(fm.openMap),
      };
    }));
    onCleanup(() => subscription.unsubscribe());
  }
});

const number = computed(() => events.value + total.value);
</script>
<style scoped lang="less">
.container {
  height: 100%;
  box-sizing: border-box;
  margin: 0 16px;
}

.banner {
  width: 100%;
  height: 90px;
  box-sizing: border-box;
  position: relative;
  margin: 16px 16px 0;

  a {
    color: unset !important;
    pointer-events: auto;
  }

  &:before {
    display: block;
    content: ' ';
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(95.09deg, #34A352 1.97%, #0085FF 94.72%);
    opacity: 0.15;
    border-radius: 6px;
    pointer-events: none;
  }

  &-title {
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    padding:8px;
  }
}

.divider {
  width: 100%;
  border: none;
  height: 1px;
  margin: 2px;
  background: var(--divider);
}

.info {
  width: 100%;
  padding: 8px 0;

  h2 {
    font-size: 16px;
    font-weight: bold;
    color: var(--text-primary);
    line-height: 2;
    margin: 0;
  }

  a {
    color: var(--text-light) !important;
    text-decoration: none;
    font-size: 12px;
  }
}

</style>