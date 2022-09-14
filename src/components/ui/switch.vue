<template>
  <button class="switch-container" :class="modelValue ? 'left' : 'right'" type="button" @click="emits('update:modelValue', !modelValue)">
    <span class="text left">2D</span>
    <span class="text right">3D</span>
  </button>
</template>
<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
}>()
const emits = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();



</script>
<style scoped>
.switch-container {
  display: inline-flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  box-sizing: border-box;
  height: 24px;
  min-height: 24px;
  max-height: 24px;
  width: 44px;
  border: 1px solid var(--c5);
  border-radius: 12px;
  z-index: 0;
  background: var(--c6);
  appearance: none;
  cursor: pointer;
}

.switch-container:after {
  display: block;
  position: absolute;
  content: ' ';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 1px;
  z-index: 1;
  transition: all .2s ease;
}

.switch-container.left:after {
  left: 1px;
}

.switch-container.right:after {
  left: 21px;
}

.text {
  z-index: 0;
  font-size: 12px;
  color: white;
}
</style>