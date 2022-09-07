<template>
  <flex info direction="row" justify="center">
    <a class="more-info" href="https://ossinsight.io/blog/why-we-choose-tidb-to-support-ossinsight">🤖️ how to make
      it</a>
    <flex-spacer />
    <span style="color: var(--text-secondary); font-size: 12px" v-if="size.up('sm')">Powered by</span>
    &nbsp;
    &nbsp;
    <a href="https://en.pingcap.com/tidb-cloud?utm_source=ossinsight&utm_medium=referral" target="_blank">
      <img src="/logos/tidbcloud.png" alt="TiDB Cloud" height="16" />
    </a>
    &nbsp;
    &nbsp;
    <a href="https://pulsar.apache.org" target="_blank">
      <img src="/logos/pulsar.png" alt="Pulsar" height="16" />
    </a>
  </flex>
</template>
<script lang="ts" setup>
import Flex from '@/components/ui/flex.vue';
import FlexSpacer from '@/components/ui/flex-spacer.vue';
import { useSize } from "@/store";

const size = useSize();
</script>
<style scoped>
.more-info {
  color: var(--text-light) !important;
  text-decoration: none;
  font-size: 12px;
}
</style>