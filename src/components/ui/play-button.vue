<template>
  <button @click="emits('update:modelValue', !props.modelValue)" :title="props.modelValue ? 'Pause' : 'Play'">
    <Pause v-if="props.modelValue" viewBox="0 0 48 48" />
    <Play v-else viewBox="0 0 48 48" />
  </button>
</template>
<script lang="ts" setup>
import Play from '../icons/play.svg?component';
import Pause from '../icons/pause.svg?component';

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
</script>
<style scoped>
button {
  display: inline-block;
  vertical-align: text-bottom;
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

svg {
  width: 20px;
  height: 20px;
}
</style>