<template>
  <span class="event" :class="event.prEventType">
    <span class="dot" />
    <GhUser :login='event.actorLogin' :is-new="!!event.isDevDay" />
    {{ event.prEventType }}
    <GhPr :repo='event.repoName' :number='event.pr' />
    in
    <GhRepo :name='event.repoName' />
    <span v-if="event.language" class="language">{{ event.language }}</span>
    <span v-if="event.additions" class="code-changes addition">+{{event.additions}}</span>
    <span v-if="event.deletions" class="code-changes deletion">-{{event.deletions}}</span>
  </span>
</template>
<script setup lang="ts">
import GhUser from './gh-user.vue';
import GhPr from './gh-pr.vue';
import GhRepo from './gh-repo.vue';
import { FilteredEvent } from "@/store/poll";
import { toRefs } from "vue";
import GhAvatar from "@/components/ui/gh-avatar.vue";

const props = defineProps<{ event: FilteredEvent }>();
const { event } = toRefs(props)

</script>
<style lang="less" scoped>
.event {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  user-select: none;

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

  .language {
    display: inline-block;
    padding: 2px 4px;
    line-height: 1;
    font-size: 12px;
    font-weight: bolder;
    background: var(--b6);
    color: var(--text-primary);
    border-radius: 3px;
    transform: scale(calc(10 / 12));
  }

  .code-changes {
    display: inline-block;
    margin-left: 4px;
    font-size: 12px;
    font-weight: bold;
    &.addition {
      color: var(--c1);
    }
    &.deletion {
      color: var(--c2);
    }
  }
}
</style>