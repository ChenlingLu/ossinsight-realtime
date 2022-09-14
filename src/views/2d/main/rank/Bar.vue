<template>
  <Popper class="bar" placement="bottom">
    <template v-slot:label>
      <span class="item opened" :style="{ width: (opened / total) * 100 + '%' }" />
      <span class="item merged" :style="{ width: (merged / total) * 100 + '%' }" />
      <span class="item closed" :style="{ width: (closed / total) * 100 + '%' }" />
    </template>
    <Info v-bind="props" />
  </Popper>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import Info from './Info.vue';
import Popper from "@/components/ui/popper.vue";

const props = defineProps<{
  opened: number
  merged: number
  closed: number
}>();

const total = computed(() => props.opened + props.closed + props.merged);
</script>
<style scoped>
.bar {
  display: inline-flex !important;
  flex-direction: row;
  align-items: center;
  width: 100px;
  font-size: 12px;
  height: 1em;
}

.item {
  height: 100%;
}

.item.opened {
  background: var(--c1);
}

.item.closed {
  background: var(--c2);
}

.item.merged {
  background: var(--c7);
}
</style>