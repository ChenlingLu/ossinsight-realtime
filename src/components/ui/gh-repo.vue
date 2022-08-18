<template>
  <a :href="`https://github.com/${props.name}`" target="_blank">{{props.name}}</a>
</template>
<script setup lang="ts">
const props = defineProps<{name: string}>()
</script>
