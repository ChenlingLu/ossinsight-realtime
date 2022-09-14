<template>
  <div class="app" :style="{ '--side-size': size.up(route.meta.main?.breakpoint ?? 'md') ? undefined : '100%' }">
    <template v-if="size.up(route.meta.main?.breakpoint ?? 'md')">
      <header>
        <Logo class="logo" />
        <flex-spacer />
        <h1 :style="route.meta.title.style">{{route.meta.title.text}}</h1>
        <flex-spacer />
      </header>
      <main class="main" :style="route.meta.main?.style">
        <router-view name="default" />
      </main>
    </template>
    <aside class="side" :style="route.meta.side?.style">
      <router-view name="side" />
    </aside>
  </div>
</template>
<script lang="ts" setup>
import { useSize } from "@/store/size";
import { useRoute } from "vue-router";
import Logo from './ossinsight.svg?component';
import FlexSpacer from "@/components/ui/flex-spacer.vue";

const size = useSize()
const route = useRoute()
</script>
<style scoped>
header {
  position: absolute;
  padding: 8px;
  width: var(--main-size);
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  height: 64px;
}

header h1 {
  font-size: 24px;
  margin: 0;
  line-height: 48px;
  height: 48px;
}

.logo {
  height: 48px;
}

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