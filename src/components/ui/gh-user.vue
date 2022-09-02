<template>
  <a :href="href" target="_blank" :class="{new: props.isNew}">{{ props.login }}</a>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  login: string
  isNew?: boolean
  url?: string
}>();

const BOT_REGEXP = /\[bot]$/

const href = computed(() => {
  const { login } = props
  if (BOT_REGEXP.test(login)) {
    return `https://github.com/apps/${login.replace(BOT_REGEXP, '')}`
  } else {
    return `https://github.com/${login}`
  }
})
</script>
<style scoped>
</style>
