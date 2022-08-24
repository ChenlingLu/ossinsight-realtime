<template>
  <input class="repo-filter" :value="props.modelValue" @input="onChange" placeholder="Filter by keyword" />
</template>
<script lang="ts" setup>
const props = defineProps<{ modelValue: string }>();
const emits = defineEmits(['update:modelValue']);

const onChange = (event: any) => {
  emits('update:modelValue', event.currentTarget.value);
};
</script>
<style scoped lang="less">
.repo-filter {
  font-family: -apple-system, "PingFang SC", "Helvetica", sans-serif;
  appearance: none;
  border: 1px solid #c7c7c780;
  color: #2c2c2c;
  font-weight: 400;
  padding: 8px;
  font-size: 14px;
  border-radius: 3px;
  outline: none;
  transition: box-shadow .2s ease, border-color .2s ease;
}

.repo-filter:focus {
  box-shadow: 0 0 3px 0 #0085FF;
  border-color: #0085FF80;
}
</style>