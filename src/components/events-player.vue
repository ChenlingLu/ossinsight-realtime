<template>
  <flex info direction="row" justify="space-between">
    <h2 class="events-player-title">
      <PlayButton v-model="play" />
      Real-Time Pull Requests
    </h2>
  </flex>
  <flex v-if="size.height > 530" info direction="row" justify="space-between">
    <LangSelect v-model="language" />
    <RepoFilter v-model="repo" style="margin-left: 16px; flex: 1" />
  </flex>
  <event-list :stream="prEvents.stream" :language="language" :repo="repo" :play="play" />
</template>
<script lang="ts" setup>
import Flex from '@/components/ui/flex.vue';
import LangSelect from "@/components/ui/lang-select.vue";
import RepoFilter from "@/components/ui/repo-filter.vue";
import EventList from "@/components/event-list.vue";
import PlayButton from "@/components/ui/play-button.vue";
import { ref } from "vue";
import { prEventsPollStore } from "@/store/poll";
import { useSize } from "@/store";

const language = ref('Any Language');
const repo = ref('');
const play = ref(true);

const size = useSize()

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
</style>