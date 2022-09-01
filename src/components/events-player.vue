<template>
  <flex info direction="row" justify="space-between">
    <h2 class="events-player-title">
      <PlayButton v-model="play" />
      Real-Time Pull Requests
    </h2>
  </flex>
  <flex info direction="row" justify="space-between">
    <LangSelect v-model="language" />
    <RepoFilter v-model="repo" style="margin-left: 16px; flex: 1" />
  </flex>
  <event-list :stream="prEvents.stream" :language="language" :repo="repo" :play="play" />
  <divider />
  <flex info direction="row" justify="center">
    <a class="more-info" href="https://ossinsight.io/blog/why-we-choose-tidb-to-support-ossinsight">🤖️ how to make it</a>
    <flex-spacer />
    <span style="color: var(--text-secondary); font-size: 12px">Powered by</span>
    &nbsp;
    &nbsp;
    <img src="/logos/tidbcloud.png" alt="TiDB Cloud" height="16" />
    &nbsp;
    &nbsp;
    <img src="/logos/pulsar.png" alt="Pulsar" height="16" />
  </flex>
</template>
<script lang="ts" setup>
import Flex from '@/components/ui/flex.vue';
import LangSelect from "@/components/ui/lang-select.vue";
import RepoFilter from "@/components/ui/repo-filter.vue";
import EventList from "@/components/event-list.vue";
import PlayButton from "@/components/ui/play-button.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";
import { ref } from "vue";
import { prEventsPollStore } from "@/store/poll";
import Divider from "@/components/ui/divider.vue";

const language = ref('Any Language');
const repo = ref('');
const play = ref(true);

const usePrEvents = prEventsPollStore('pullRequestEvents');
const prEvents = usePrEvents();
</script>
<style lang="less" scoped>

.events-player-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 2;
  margin: 0;
}

.more-info {
  color: var(--text-light) !important;
  text-decoration: none;
  font-size: 12px;
}

</style>