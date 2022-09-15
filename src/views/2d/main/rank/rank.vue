<template>
  <div class="table-container">
    <flex class="b" direction="column" full-width :style="{'--rank-count': ranks.length}">
      <flex direction="row" full-width gap="8px">
        <div class="bl" v-for="{ key, title, icon } in ranks" :key="key" style="flex: 1">
          <flex class="heading" direction="row" gap="8px" style="padding: 4px">
            <v-node-wrapper :value="icon" />
            <span>
              {{ title }}
            </span>
          </flex>
        </div>
      </flex>
      <flex direction="column" full-width>
        <flex class="bt" direction="row" full-width v-for="(_, i) in 5" :key="i" gap="8px">
          <flex class="bl data" v-for="{ key, render, store: { data } } in ranks" :key="key"
                style="flex: 1; min-width: 0; padding: 4px">
            <template v-if="data">
              <v-node-wrapper :value="render(data.data[i])" />
            </template>
            <template v-else>loading...</template>
          </flex>
        </flex>
      </flex>
    </flex>
  </div>
</template>
<script lang="ts" setup>
import { h, VNode } from "vue";
import VNodeWrapper from "@/components/ui/v-node-wrapper.vue";
import { ApiMap, useApiDataStore } from "@/store/apiData";
import TopRepo from './TopRepo.vue';
import TopUser from './TopUser.vue';
import RepoSvg from '@primer/octicons/build/svg/repo-16.svg?component';
import PeopleSvg from '@primer/octicons/build/svg/people-16.svg?component';
import Flex from "@/components/ui/flex.vue";

type RankDetails<T extends keyof ApiMap = keyof ApiMap> = {
  key: T
  title: string
  icon: VNode
  render: (data: ApiMap[T]) => VNode
  store: ReturnType<typeof useApiDataStore<T>>
}

const ranks: RankDetails[] = [
  {
    key: 'live-time-top-repos-by-prs-daily',
    title: 'Top 5 Active Repositories Last 24 Hours',
    icon: h(RepoSvg),
    render: props => h(TopRepo as any, props),
    store: useApiDataStore('live-time-top-repos-by-prs-daily'),
  },
  {
    key: 'live-time-top-developers-by-prs-daily',
    title: 'Top 5 Active Developers Last 24 Hours',
    icon: h(PeopleSvg),
    render: props => h(TopUser as any, props),
    store: useApiDataStore('live-time-top-developers-by-prs-daily'),
  },
];

</script>
<style scoped>

.table-container {
  width: 100%;
  overflow-x: scroll;
  padding: 8px;
  box-sizing: border-box;
  font-size: 12px;
}

@media screen and (min-width: 1080px) {
  .table-container {
    font-size: 14px;
  }
}

@media screen and (min-width: 1440px) {
  .table-container {
    font-size: 16px;
  }
}

.heading {
  font-size: calc(1em + 2px);
  font-weight: bold;
}

.data {
}

:deep(a) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(span) {
  display: inline-block;
  white-space: nowrap;
}

.b {
  border: 2px dashed var(--border);
}

.bt {
  border-top: 2px dashed var(--border);
}

.bl:not(:first-child) {
  border-left: 2px dashed var(--border);
}
</style>