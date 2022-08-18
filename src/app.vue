<template>
  <div class="app">
    <a href="https://ossinsight.io" target="_blank">
      <img class="logo" src="/logos/ossinsight.svg" height="45" alt="OSSInsight Logo">
    </a>
    <header class="heading">
      <h1>
        How We Build the World by Coding
      </h1>
      <p>
        {{ formattedDate }}
      </p>
    </header>
    <main class="main">
      <Scene />
    </main>
    <footer>
      <p>Inspired by <GhRepo name="honzaap/GithubCity"/></p>
    </footer>
    <aside class="side">
      <Side />
    </aside>
  </div>
</template>
<script setup lang="ts">
import Scene from "./components/scene.vue";
import Side from "./components/side";
import { computed, ref } from "vue";
import GhRepo from "./components/ui/gh-repo.vue";

const sideSize = '450px';
const now = ref(new Date());

setInterval(() => {
  now.value = new Date();
}, 1000);

const fmt = new Intl.DateTimeFormat('en', {
  // year: 'numeric',
  // month: '2-digit',
  // day: '2-digit',
  // hour: '2-digit',
  // minute: '2-digit',
  // second: '2-digit',
  // timeZoneName: "shortOffset",
  hour12: false,
  timeStyle: 'full',
  dateStyle: 'full'
});

const formattedDate = computed(() => {
  const date = now.value;
  return fmt.format(date);
});

</script>
<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.main {
  width: calc(100% - v-bind(sideSize));
}

.side {
  width: v-bind(sideSize);
}

.logo {
  position: fixed;
  z-index: 1000;
  left: 8px;
  top: 8px;
}

header {
  width: calc(100% - v-bind(sideSize));
  position: fixed;
  left: 0;
  top: 16px;
  pointer-events: none;
}

header h1 {
  margin: 0 auto;
  text-align: center;
  color: white;
}

header p {
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: white;
}

footer {
  width: calc(100% - v-bind(sideSize));
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