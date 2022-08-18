<template>
  <select class="lang-select" :value="props.modelValue" @input="onChange">
    <option v-for="language in languages" :key="language" :value="language">
      {{ language }}
    </option>
  </select>
</template>
<script lang="ts" setup>
const props = defineProps<{ modelValue: string }>();
const emits = defineEmits(['update:modelValue']);
import { languages } from "./lang";

const onChange = (event: any) => {
  emits('update:modelValue', event.currentTarget.value);
};
</script>
<style scoped lang="less">
.lang-select {
  font-family: -apple-system, "PingFang SC", "Helvetica", sans-serif;
  appearance: none;
  border: 1px solid #c7c7c780;
  background: #ebebeb80;
  color: #2c2c2c;
  font-weight: 400;
  padding: 8px;
  font-size: 14px;
  border-radius: 3px;
  min-width: 140px;
  outline: none;
}
</style>