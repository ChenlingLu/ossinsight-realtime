<template>
  <Teleport :to="props.container ?? 'body'">
    <div class="container">
      <div class="content">
        <p class="headline bold">
          <template v-if="props.isToday">
            Total <a href="https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#pullrequestevent" target="_blank">Pull Request Events</a> today
          </template>
          <template v-else>
            Total Pull Requests at {{ props.date }}
          </template>
        </p>
        <p class="data">
          <PrIcon />
          <span class="number">{{ props.value.toLocaleString('en') }}</span>
        </p>
        <hr />
        <p class="headline extra">
          <span class="dot developers"/>
          Contributed by <span class="number">{{ props.developers.toLocaleString('en') }}</span> developers
        </p>
        <p class="headline extra">
          <span class="dot merged"/>
          Closed <span class="number">{{ props.merged.toLocaleString('en') }}</span> PRs
        </p>
        <p class="headline extra">
          <span class="dot opened"/>
          Opened <span class="number">{{ props.opened.toLocaleString('en') }}</span> PRs
        </p>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { Teleport } from "vue";
import PrIcon from '@primer/octicons/build/svg/git-pull-request-16.svg?component';

const props = defineProps<{ container?: HTMLElement, isToday: boolean, date: string, value: number, floor: number, developers: number, merged: number, opened: number }>();

</script>
<style scoped>
.container {
  /*height: 305px;*/
}

.content {
  position: relative;
  margin-top: -50%;
  transform: translate3d(-2px, -8px, 0);
  border-radius: 4px;
  color: white;
  background: var(--tooltip-bg);
  white-space: pre-wrap;
  padding: 8px;
  font-family: -apple-system, "PingFang SC", "Helvetica", sans-serif;
}

.content:after {
  position: absolute;
  content: " ";
  left: calc(50% - 2px);
  bottom: -4px;
  display: block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgba(0, 0, 0, 0.8);
}

p {
  margin: 4px;
  fill: white;
}

svg {
  margin-right: 8px;
  margin-left: 4px;
}

.headline {
  font-size: 14px;
}

.number {
  font-weight: bold;
  font-family: monospace;
}

.data .number {
  font-size: 28px;
}

hr {
  border: none;
  background: var(--text-secondary);
  height: 1px;
  margin: 8px;
}

.colored {
  color: #FFE895;
}

.extra {
  font-size: 12px;
  color: var(--text-secondary);
}

.bold {
  font-weight: bold;
}

.data{
  line-height: 1.5;
}

a {
  color: unset !important;
  pointer-events: auto;
}


.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin-right: 3px;
  vertical-align: middle;
}

.opened.dot {
  background: var(--c1);
}

.developers.dot {
  background: var(--c3);
}

.merged.dot {
  background: var(--c7);
}
</style>