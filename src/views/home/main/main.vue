<template>
  <Scene />
  <demo-tag />
  <footer>
    <p>Inspired by
      <GhRepo name="honzaap/GithubCity" />
    </p>
  </footer>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import Logo from '../../../ossinsight.svg?component';
import Scene from "@/views/home/main/scene.vue";
import GhRepo from "@/components/ui/gh-repo.vue";
import DemoTag from "@/components/ui/demo-tag.vue";

const now = ref(new Date());

setInterval(() => {
  now.value = new Date();
}, 1000);

const fmt = new Intl.DateTimeFormat('en', {
  hour12: false,
  timeStyle: 'full',
  dateStyle: 'short',
  timeZone: 'UTC',
});

const formattedDate = computed(() => {
  const date = now.value;
  return fmt.format(date);
});
</script>
<style scoped>
footer {
  width: var(--main-size);
  position: fixed;
  left: 0;
  bottom: 16px;
  pointer-events: none;
}

footer p {
  font-size: 12px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

footer p a {
  color: white !important;
  text-decoration: underline;
  pointer-events: auto;
}
</style>
