<template>
  <flex class="container-2d" direction="column" full-height full-width>
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
import Logo from '@/ossinsight.svg';
import FlexSpacer from "@/components/ui/flex-spacer.vue";</script>
<style scoped>
.container-2d {
  padding-top: 64px;
}

footer {
  padding: 8px;
}

strong {
  font-weight: bolder;
}
</style>