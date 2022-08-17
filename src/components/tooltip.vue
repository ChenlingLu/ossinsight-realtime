<template>
  <Teleport :to="props.container ?? 'body'">
    <div class="container">
      <div class="content">
        {{ props.text }}
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { defineProps, Teleport } from "vue";

const props = defineProps<{ container?: HTMLElement, text: string }>()
</script>
<style scoped>
.container {
  height: 106px;
}
.content {
  position: relative;
  border-radius: 4px;
  color: white;
  background: rgba(0,0,0,0.8);
  white-space: pre-wrap;
  padding: 4px 8px;
  font-family: -apple-system, "PingFang SC", "Helvetica", sans-serif;
}
.content:after {
  position: absolute;
  content: " ";
  left: calc(50% - 2px);
  bottom: -4px;
  display: block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid rgba(0,0,0,0.8);
}
</style>