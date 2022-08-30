<template>
  <flex direction="row" justify="center" align="center" style="margin-top: 8px">
    <Dot :color="colorMap[state]" style="margin-right: 4px" />
    <span class="numbers">
      {{ number.toLocaleString('en') }}
    </span>
  </flex>
</template>
<script lang="ts" setup>
import Flex from "@/components/ui/flex.vue";
import Dot from "@/components/ui/dot.vue";
import { ConnectionState } from "@/api/poll";

const props = defineProps<{
  state: ConnectionState
  number: number
}>();

const colorMap = {
  [ConnectionState.ERROR]: 'red',
  [ConnectionState.CLOSED]: 'gray',
  [ConnectionState.CONNECTING]: 'yellow',
  [ConnectionState.CONNECTED]: 'var(--c6)',
};

</script>
<style scoped>
.numbers {
  font-size: 24px;
  font-weight: bold;
  font-family: monospace;
}
</style>