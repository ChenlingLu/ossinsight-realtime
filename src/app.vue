<template>
  <div id="app">
    <main class="main">
      <Scene />
    </main>
    <aside class="side">

    </aside>
  </div>
</template>
<script setup lang="ts">
import Scene from "./components/scene.vue";
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