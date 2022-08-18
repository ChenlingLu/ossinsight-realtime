<template>
  <a :href="`https://github.com/${props.repo}/pull/${props.number}`" target="_blank">#{{props.number}}</a>
</template>
<script setup lang="ts">
const props = defineProps<{repo: string, number: number}>()
</script>
