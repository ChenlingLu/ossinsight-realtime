<template>
  <Popper placement="bottom">
    <template v-slot:label>
      <svg width="2" height="2" class="pie" viewBox="-1 -1 2 2">
        <path v-for="{ type, d } in list" :key="type" :class="type" :d="d" />
      </svg>
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

function arc(from: number, to: number): string {
  let large = to - from > Math.PI ? 1 : 0;
  return `M ${Math.cos(from).toFixed(2)} ${Math.sin(from).toFixed(2)} A 1 1 0 ${large} 1 ${Math.cos(to).toFixed(2)} ${Math.sin(to).toFixed(2)} L 0 0`;
}

const list = computed(() => {
  let from = Math.PI;
  let to = 0;
  const list: { type: string, d: string }[] = [];
  if (props.opened) {
    to = from + Math.PI * 2 * props.opened / total.value;
    list.push({
      type: 'opened',
      d: arc(from, to),
    });
    from = to;
  }
  if (props.merged) {
    to = from + Math.PI * 2 * props.merged / total.value;
    list.push({
      type: 'merged',
      d: arc(from, to),
    });
    from = to;
  }
  if (props.closed) {
    to = from + Math.PI * 2 * props.closed / total.value;
    list.push({
      type: 'closed',
      d: arc(from, to),
    });
  }
  return list;
});

</script>
<style scoped>
.pie {
  width: 1em;
  height: 1em;
}

.opened {
  fill: var(--c1);
}

.closed {
  fill: var(--c2);
}

.merged {
  fill: var(--c7);
}
</style>