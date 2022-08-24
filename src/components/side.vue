<template>
  <flex class="container">
    <flex class="banner">
      <h2 class="banner-title">
        <span>
          Total <a
            href="https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#pullrequestevent"
            target="_blank">Pull Request Events</a> made by developers {{ (new Date()).getUTCFullYear() }}
        </span>
        <flex direction="row" justify="center" align="center" style="margin-top: 8px">
          <Dot :color="colorMap[state]" style="margin-right: 4px" />
          <span class="numbers">
            {{ number }}
          </span>
        </flex>
      </h2>
    </flex>
    <hr class="divider" />
    <flex class="info" direction="row" justify="space-between">
      <h2>Real-Time Pull Requests</h2>
      <a href="https://ossinsight.io/blog/why-we-choose-tidb-to-support-ossinsight">🤖️ how to make it</a>
    </flex>
    <flex class="info" direction="row" justify="space-between">
      <LangSelect v-model="language" />
      <RepoFilter v-model="repo" style="margin-left: 16px; flex: 1" />
    </flex>
    <event-list :source="prEvents" :language="language" :repo="repo" />
    <hr class="divider" />
    <flex class="info" direction="row" justify="center">
      <span style="color: #7c7c7c; font-size: 16px">Powered by</span>
      &nbsp;
      &nbsp;
      <img src="/logos/tidbcloud.png" alt="TiDB Cloud" height="20" />
      &nbsp;
      &nbsp;
      <img src="/logos/pulsar.png" alt="Pulsar" height="20" />
    </flex>
  </flex>
</template>
<script setup lang="ts">
import Flex from "./ui/flex.vue";
import { computed, ref, watchEffect } from "vue";
import { prEventsPollStore } from "@/store/poll";
import { useActive } from "./hooks/lifecycle";
import Dot from "./ui/dot.vue";
import { ConnectionState, RawSamplingFirstMessage } from "@/api/poll";
import LangSelect from "./ui/lang-select.vue";
import RepoFilter from "./ui/repo-filter.vue";
import EventList from "./event-list.vue";

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

const colorMap = {
  [ConnectionState.ERROR]: 'red',
  [ConnectionState.CLOSED]: 'gray',
  [ConnectionState.CONNECTING]: 'yellow',
  [ConnectionState.CONNECTED]: '#34A352',
};

prEvents.stream.onStateChange(newState => state.value = newState);

watchEffect((onCleanup) => {
  if (active.value) {
    const subscription = prEvents.stream.subscribe(() => total.value++);
    if (prEvents.stream.lastFirstMessage) {
      events.value = getEventCount(prEvents.stream.lastFirstMessage);
      total.value = 0;
    }
    subscription.add(prEvents.firstMessage.subscribe(fm => {
      events.value = getEventCount(fm);
      total.value = 0;
    }));
    onCleanup(() => subscription.unsubscribe());
  }
});

const number = computed(() => (events.value + total.value).toLocaleString('en'));
</script>
<style scoped lang="less">
.container {
  height: 100%;
  box-sizing: border-box;
  margin: 0 16px;
}

.banner {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  margin: 16px;

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

    .numbers {
      font-size: 24px;
      font-weight: bold;
      font-family: monospace;
    }
  }
}

.divider {
  width: 100%;
  border: none;
  height: 1px;
  background: #e5e5e5;
}

.info {
  width: 100%;
  padding: 16px 0;

  h2 {
    font-size: 18px;
    font-weight: normal;
    color: #2c2c2c;
    line-height: 1;
    margin: 0;
  }

  a {
    color: #abaaaa !important;
    text-decoration: none;
    font-size: 12px;
  }
}

</style>