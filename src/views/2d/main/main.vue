<template>
  <flex direction="column" full-height full-width>
    <header>
      <Logo class="logo" />
      <h1>Real-time GitHub Contribution Insight</h1>
    </header>
    <flex-spacer />
    <bubbles />
    <flex-spacer />
    <rank />
    <footer>
      Get more insights about <strong>rankings</strong>, <strong>repositories</strong> and <strong>developers</strong>
      from <a href="https://ossinsight.io/" target="_blank">ossinsight.io</a>
    </footer>
  </flex>
</template>
<script lang="ts" setup>
import Bubbles from "./bubbles.vue";
import Rank from './rank';
import Flex from "@/components/ui/flex.vue";
import Logo from '@/views/ossinsight.svg?component';
import FlexSpacer from "@/components/ui/flex-spacer.vue";</script>
<style scoped>
footer {
  padding: 8px;
}

header {
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.logo {
  height: 48px;
}

strong {
  font-weight: bolder;
}

header h1 {
  margin: 0 auto;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
</style>