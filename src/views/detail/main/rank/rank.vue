<template>
  <div class="table-container">
    <table :style="{'--rank-count': ranks.length}">
      <colgroup>
        <col v-for="{ key } in ranks" :key="key">
      </colgroup>
      <thead>
      <tr>
        <td v-for="{ key, title, icon } in ranks" :key="key">
          <flex direction="row" gap="8px">
            <v-node-wrapper :value="icon" />
            <span>
              {{ title }}
            </span>
          </flex>
        </td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(_, i) in 5" :key="i">
        <td v-for="{ key, render, store: { data } } in ranks" :key="key">
          <template v-if="data">
            <v-node-wrapper :value="render(data.data[i])" />
          </template>
          <template v-else>loading...</template>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { h, VNode } from "vue";
import VNodeWrapper from "@/components/ui/v-node-wrapper.vue";
import { ApiMap, useApiDataStore } from "@/store/apiData";
import TopRepo from './TopRepo.vue';
import TopUser from './TopUser.vue';
import RepoSvg from '@primer/octicons/build/svg/repo-16.svg?component';
import PeopleSvg from '@primer/octicons/build/svg/People-16.svg?component';
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
    title: 'Top 5 Active Repository Last 24 Hours',
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
table {
  border-collapse: collapse;
  margin: 16px;
  min-width: calc(100% - 32px);
  color: var(--text-primary);
}

col {
  /*noinspection CssUnresolvedCustomProperty*/
  width: calc(100% / var(--rank-count));
}

.table-container {
  width: 100%;
  overflow-x: scroll;
}

table, th, td {
  border: 2px dashed var(--border);
}

td {
  padding: 8px;
}

:deep(a) {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(span) {
  display: inline-block;
  white-space: nowrap;
}

/* thead {
  font-weight: bold;
} */

</style>
<style lang="less" scoped>
thead {
  font-size: 14px;
  font-weight: bold;
}

tbody {
  font-size: 12px
}


@media screen and (min-width: 1080px) {
  thead {
    font-size: 14px;
  }

  tbody {
    font-size: 12px
  }
}

@media screen and (min-width: 1440px) {
  thead {
    font-size: 18px;
  }

  tbody {
    font-size: 16px
  }
}

</style>