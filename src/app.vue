<template>
  <div class="app">
    <div class="heading">
      <h1>
        <img src="/logos/ossinsight.svg" height="45" alt="OSSInsight Logo" style="vertical-align: text-bottom">
        How We Build the World by Coding
      </h1>
      <p>
        {{ formattedDate }}
      </p>
    </div>
    <main class="main">
      <Scene />
    </main>
    <aside class="side">
      <Side />
    </aside>
  </div>
</template>
<script setup lang="ts">
import Scene from "./components/scene.vue";
import Side from "./components/side";
import { computed, ref } from "vue";

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

header {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 10000;
  pointer-events: none;
}

.heading {
  width: calc(100% - v-bind(sideSize));
  position: fixed;
  left: 0;
  top: 16px;
  pointer-events: none;
}

.heading h1 {
  margin: 0 auto;
  text-align: center;
  color: white;
}

.heading p {
  margin-top: 16px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: white;
}
</style>