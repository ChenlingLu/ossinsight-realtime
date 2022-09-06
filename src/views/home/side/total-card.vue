<template>
  <flex direction="row" justify="center" align="center" style="margin-top: 4px">
    <Dot :color="colorMap[state]" style="margin-right: 12px" />
    <animated-number class="numbers" :value="number" comma />
  </flex>
</template>
<script lang="ts" setup>
import Flex from "@/components/ui/flex.vue";
import Dot from "@/components/ui/dot.vue";
import AnimatedNumber from '@/components/ui/animated-number';
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
  font-size: 30px;
  font-weight: bold;
  font-family: monospace;
}
</style>