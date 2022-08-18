<template>
  <span class="event">
    <GhUser :login='event["actor.login"]' /> {{ event['payload.action'] }} PR<GhPr :repo='event["repo.name"]' :number='event["payload.pull_request.number"]' /> in <GhRepo :name='event["repo.name"]' />
  </span>
</template>
<script setup lang="ts">
import GhUser from './gh-user.vue';
import GhPr from './gh-pr.vue';
import GhRepo from './gh-repo.vue';
import { FilteredEvent } from "../../store/poll";
import { toRefs } from "vue";

const props = defineProps<{ event: FilteredEvent }>();
const { event } = toRefs(props)
</script>
<style lang="less" scoped>
.event {
  display: block;
  font-size: 12px;
  color: #565656;

  &:deep(a) {
    text-decoration: none !important;
    color: #2c2c2c !important;
    font-weight: bold;
  }
}
</style>