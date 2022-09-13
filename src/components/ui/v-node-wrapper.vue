<template>
  <Value />
</template>
<script lang="ts" setup>
import { VNode } from "vue";

const props = defineProps<{
  value: VNode
}>();

const Value = () => props.value;
</script>