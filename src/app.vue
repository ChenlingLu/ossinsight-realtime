<template>
  <div class="app">
    <main v-if="size.up('md')" class="main">
      <router-view name="default" />
    </main>
    <aside class="side">
      <router-view name="side" />
    </aside>
  </div>
</template>
<script lang="ts" setup>
import { useSize } from "@/store/size";

const size = useSize()
</script>
<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  display: flex;
}

.main {
  width: var(--main-size);
}

.side {
  width: var(--side-size);
}

</style>