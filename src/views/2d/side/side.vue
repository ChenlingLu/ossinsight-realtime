<template>
  <flex class="side-container">
    <status-card
        v-bind="summary"
        time="LAST 24 HOURS"
    >
      <template v-slot:footer>
        <flex class="footer" direction="row" align="center" justify="flex-start" gap="8px">
          <count-down size="12px" :duration="20" @tick="summaryData.reload()"/>
          <span>
            Last Updated At: {{lastUpdated}}
          </span>
        </flex>
      </template>
    </status-card>
    <template v-if="size.height >= 400">
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
import { computed } from "vue";
import Flex from "@/components/ui/flex.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";
import EventsPlayer from "@/components/events-player.vue";
import Divider from "@/components/ui/divider.vue";
import { useSize } from "@/store";
import StatusCard from "@/components/status-card/StatusCard.vue";
import SideFooter from "@/components/side-footer.vue";
import { useApiDataStore } from "@/store/apiData";
import CountDown from "@/components/ui/count-down.vue";

const summaryData = useApiDataStore('live-time-base-information-hourly');

const size = useSize();

const summary = computed(() => {
  const data = summaryData.single
  return {
    developers: data?.developers ?? 0,
    repositories: data?.repos ?? 0,
    merged: data?.merged_prs ?? 0,
    opened: data?.opened_prs ?? 0,
    closed: data?.closed_prs ?? 0,
    additions: data?.additions ?? 0,
    deletions: data?.deletions ?? 0,
  };
});

const fmt = new Intl.DateTimeFormat('en', {
  timeStyle: 'medium',
})

const lastUpdated = computed(() => summaryData.finishedAt ? fmt.format(summaryData.finishedAt) : '--')

</script>
<style scoped lang="less">
.footer {
  width: 100%;
  padding: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>