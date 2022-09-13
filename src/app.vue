<template>
  <div class="app" :style="{ '--side-size': size.up(route.meta.main?.breakpoint ?? 'md') ? undefined : '100%' }">
    <main v-if="size.up(route.meta.main?.breakpoint ?? 'md')" class="main" :style="route.meta.main?.style">
      <router-view name="default" />
    </main>
    <aside class="side" :style="route.meta.side?.style">
      <router-view name="side" />
    </aside>
  </div>
</template>
<script lang="ts" setup>
import { useSize } from "@/store/size";
import { useRoute } from "vue-router";

const size = useSize()
const route = useRoute()
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