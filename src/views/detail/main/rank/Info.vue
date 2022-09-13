<template>
  <flex class="info" gap="8px">
    <flex direction="row" v-for="key in KEYS" :key="key">
      <span class="dot" :class="key" />
      <span>
        {{ capitalize(key) }}: {{ props[key] }} PRs
      </span>
      <flex-spacer />
      <span>{{ (props[key] / total * 100).toFixed(0) }}%</span>
    </flex>
  </flex>
</template>
<script lang="ts" setup>
import { capitalize, computed } from "vue";
import Flex from "@/components/ui/flex.vue";
import FlexSpacer from "@/components/ui/flex-spacer.vue";

const KEYS = ['opened', 'merged', 'closed'] as const;

const props = defineProps<{
  opened: number
  merged: number
  closed: number
}>();

const total = computed(() => props.opened + props.closed + props.merged);
</script>
<style scoped>
.info {
  font-size: 12px;
  color: var(--text-light);
  width: 180px;
  margin: 0;
  padding: 4px;
}

.info > * {
  width: 100%;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin-right: 3px;
}

.dot.opened {
  background: var(--c1);
}

.dot.closed {
  background: var(--c2);
}

.dot.merged {
  background: var(--c7);
}
</style>