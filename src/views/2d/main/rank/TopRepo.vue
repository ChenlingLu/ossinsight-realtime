<template>
  <flex direction="row" style="width: 100%">
    <GhAvatar :name="repo_name" style="margin-right: 4px" />
    <GhRepo :name="repo_name" style="flex: 1; margin-right: 8px" />
    <span>{{ opened_prs + closed_prs + merged_prs }} events</span>
    <Pie :opened="opened_prs" :closed="closed_prs" :merged="merged_prs" style="cursor: pointer; height: 1em; margin-left: 4px" />
  </flex>
</template>
<script lang="ts" setup>
import Flex from "@/components/ui/flex.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";
import GhRepo from "@/components/ui/gh-repo.vue";
import GhAvatar from "@/components/ui/gh-avatar.vue";
import Pie from "@/views/2d/main/rank/Pie.vue";

const props = defineProps<{
  closed_prs: number
  merged_prs: number
  opened_prs: number
  repo_id: number
  repo_name: string
  total_prs: number
}>();
</script>