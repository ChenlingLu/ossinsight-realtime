<template>
  <span class="event">
    <GhUser :login='event.actorLogin' /> {{ event.action }} PR<GhPr :repo='event.repoName' :number='event.pr' /> in <GhRepo :name='event.repoName' />
  </span>
</template>
<script setup lang="ts">
import GhUser from './gh-user.vue';
import GhPr from './gh-pr.vue';
import GhRepo from './gh-repo.vue';
import { FilteredEvent } from "@/store/poll";
import { toRefs } from "vue";

const props = defineProps<{ event: FilteredEvent }>();
const { event } = toRefs(props)
</script>
<style lang="less" scoped>
.event {
  display: block;
  font-size: 12px;
  color: #565656;
  margin-bottom: 8px;

  &:deep(a) {
    text-decoration: none !important;
    color: #2c2c2c !important;
    font-weight: bold;
  }
}
</style>