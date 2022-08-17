<template>
  <div id="app">
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
</script>
<style scoped>
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.main {
  width: calc(100% - 300px);
}
.side {
  width: 300px;
}
</style>