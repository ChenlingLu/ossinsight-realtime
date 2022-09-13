<template>
  <flex direction="row" style="width: 100%">
    <GhRepo :name="repo_name" />
    <span>&nbsp;·&nbsp;{{ opened_prs + closed_prs + merged_prs }} events</span>
    <flex-spacer style="min-width: 16px" />
    <Bar :opened="opened_prs" :closed="closed_prs" :merged="merged_prs" style="cursor: pointer" />
  </flex>
</template>
<script lang="ts" setup>
import Bar from "@/views/detail/main/rank/Bar.vue";
import Flex from "@/components/ui/flex.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";
import GhRepo from "@/components/ui/gh-repo.vue";

const props = defineProps<{
  closed_prs: number
  merged_prs: number
  opened_prs: number
  repo_id: number
  repo_name: string
  total_prs: number
}>();
</script>