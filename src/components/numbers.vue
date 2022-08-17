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

const props = defineProps<{ container?: HTMLElement, text: string }>();
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