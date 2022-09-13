<template>
  <span class="avatar-container">
    <img :src="url" :alt="alt">
  </span>
</template>
<script lang="ts" setup>
import Bot from '@primer/octicons/build/svg/dependabot-16.svg?raw';
import { computed } from "vue";

const base64 = 'data:image/svg+xml;base64,' + btoa(Bot);

const props = defineProps<{
  name: string
}>();

const BOT_REGEXP = /\[bot]$/;

const url = computed(() => {
  if (BOT_REGEXP.test(props.name)) {
    return base64;
  } else {
    return `https://github.com/${props.name.split('/')[0]}.png`;
  }
});

const alt = computed(() => props.name.split('/')[0]);

console.debug(props, url, alt)
</script>
<style scoped>
.avatar-container {
  display: inline-block;
  padding: 2px;
  border-radius: 4px;
  width: calc(1.5em + 4px);
  height: calc(1.5em + 4px);
  background: white;
  line-height: 1;
  box-sizing: border-box;
}
img {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin: 0;
  line-height: 1;
}
</style>