<template>
  <span class="event" :class="event.prEventType">
    <span class="dot" />
    <GhUser :login='event.actorLogin' /> {{ event.prEventType }} PR<GhPr :repo='event.repoName' :number='event.pr' /> in <GhRepo :name='event.repoName' />
  </span>
</template>
<script setup lang="ts">
import GhUser from './gh-user.vue';
import GhPr from './gh-pr.vue';
import GhRepo from './gh-repo.vue';
import { FilteredEvent } from "@/store/poll";
import { computed, toRefs } from "vue";

const props = defineProps<{ event: FilteredEvent }>();
const { event } = toRefs(props)

</script>
<style lang="less" scoped>
.event {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;

  &:deep(a) {
    text-decoration: none !important;
    color: var(--text-primary) !important;
    font-weight: bold;
    word-break: break-all;
    transition: color .2s ease;

    &:hover {
      color: var(--link) !important;
    }
  }

  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    margin-right: 3px;
  }

  &.opened, &.reopened {
    .dot {
      background: var(--c1);
    }
  }

  &.closed {
    .dot {
      background: var(--c2);
    }
  }

  &.merged {
    .dot {
      background: var(--c7);
    }
  }
}
</style>