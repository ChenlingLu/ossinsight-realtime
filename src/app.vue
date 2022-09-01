<template>
  <div class="app">
    <main class="main">
      <router-view name="default" />
    </main>
    <aside class="side">
      <router-view name="side" />
    </aside>
  </div>
</template>
<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.main {
  width: var(--main-size);
}

.side {
  width: var(--side-size);
}

</style>