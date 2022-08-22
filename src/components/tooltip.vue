<template>
  <Teleport :to="props.container ?? 'body'">
    <div class="container">
      <div class="content">
        <p class="headline bold">
          <template v-if="props.isToday">
            Total Pull Requests today
          </template>
          <template v-else>
            Total Pull Requests at {{ props.date }}
          </template>
        </p>
        <p class="data">
          <PrIcon />
          <code class="number">{{ props.value }}</code>
        </p>
        <hr />
        <p class="headline">
          <span class="colored">
            <template v-if="props.isToday">
              Current floor:
            </template>
            <template v-else>
              Total floors:
            </template>
            {{ props.floor }}
          </span>
        </p>
        <p class="headline extra">
          *100,000 pull requests extrude 1 floor
        </p>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { defineProps, Teleport } from "vue";
import PrIcon from '@primer/octicons/build/svg/git-pull-request-16.svg?component';

const props = defineProps<{ container?: HTMLElement, isToday: boolean, date: string, value: string, floor: number }>();

</script>
<style scoped>
.container {
  /*height: 305px;*/
}

.content {
  position: relative;
  margin-top: -50%;
  border-radius: 4px;
  color: white;
  background: #2c2c2c;
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
  font-size: 28px;
  font-weight: bold;
}

hr {
  border: none;
  background: #7c7c7c;
  height: 1px;
  margin: 8px;
}

.colored {
  color: #FFE895;
}

.extra {
  color: #7c7c7c;
}

.bold {
  font-weight: bold;
}

.data{
  line-height: 1.5;
}
</style>