<template>
  <Teleport :to="container ?? 'body'">
    <div class="container">
      <div class="content">
        {{ text }}
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { defineProps, ref, Teleport } from "vue";

const text = ref('');

const { container } = defineProps<{ container?: HTMLElement }>()

defineExpose({
  update: (newValue: number) => {
    text.value = newValue.toLocaleString('en');
  },
});

</script>
<style scoped>
.container {
  height: 106px;
}
.content {
  position: relative;
  border-radius: 4px;
  color: white;
  -webkit-text-stroke: 1px black;
  white-space: pre-wrap;
  padding: 4px 8px;
  font-family: -apple-system, "PingFang SC", "Helvetica", sans-serif;
  font-size: 26px;
  font-weight: bolder;
}
</style>