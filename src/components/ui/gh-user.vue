<template>
  <a :href="`https://github.com/${props.login}`" target="_blank">{{props.login}}</a>
</template>
<script setup lang="ts">
const props = defineProps<{login: string}>()
</script>