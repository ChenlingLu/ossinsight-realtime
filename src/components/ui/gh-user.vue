<template>
  <a :href="`https://github.com/${props.login}`" target="_blank" :class="{new: props.isNew}">{{ props.login }}</a>
</template>
<script setup lang="ts">
const props = defineProps<{ login: string, isNew?: boolean }>();
</script>
<style scoped>
</style>
