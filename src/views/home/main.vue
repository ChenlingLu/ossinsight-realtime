<template>
  <a href="https://ossinsight.io" target="_blank">
    <img class="logo" src="/logos/ossinsight.svg" height="45" alt="OSSInsight Logo">
  </a>
  <header class="heading">
    <h1>
      How Developers Build the Open Source Software World Together !
    </h1>
    <p>
      {{ formattedDate }}
    </p>
  </header>
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
import Scene from "@/components/scene.vue";
import GhRepo from "@/components/ui/gh-repo.vue";
import DemoTag from "@/components/ui/demo-tag.vue";

const now = ref(new Date());

setInterval(() => {
  now.value = new Date();
}, 1000);

const fmt = new Intl.DateTimeFormat('en', {
  hour12: false,
  timeStyle: 'full',
  dateStyle: 'full',
  timeZone: 'UTC',
});

const formattedDate = computed(() => {
  const date = now.value;
  return fmt.format(date);
});
</script>
<style scoped>
.logo {
  position: fixed;
  z-index: 1000;
  left: 8px;
  top: 8px;
}

header {
  width: var(--main-size);
  position: fixed;
  left: 0;
  top: 16px;
  pointer-events: none;
}

header h1 {
  margin: 0 auto;
  text-align: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

header p {
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: white;
}

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
