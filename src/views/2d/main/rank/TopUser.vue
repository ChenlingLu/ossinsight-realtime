<template>
  <flex direction="row" style="width: 100%">
    <GhAvatar :name="actor_login" style="margin-right: 4px" />
    <GhUser :login="actor_login" />
    <span>&nbsp;·&nbsp;{{ opened_prs + closed_prs + merged_prs }} events</span>
    <flex-spacer style="min-width: 16px" />
    <Bar :opened="opened_prs" :closed="closed_prs" :merged="merged_prs" style="cursor: pointer" />
  </flex>
</template>
<script lang="ts" setup>
import Bar from "@/views/2d/main/rank/Bar.vue";
import Flex from "@/components/ui/flex.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";
import GhUser from "@/components/ui/gh-user.vue";
import GhAvatar from "@/components/ui/gh-avatar.vue";

const props = defineProps<{
  actor_id: number
  actor_login: string
  closed_prs: number
  merged_prs: number
  opened_prs: number
  total_prs: number
}>();
</script>