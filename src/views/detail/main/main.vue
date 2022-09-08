<template>
  <flex direction="row" justify="space-around" align="stretch" style="margin-top: 32px">
    <flex v-for="{ language, count, color, size } in top8" :key="language">
      <flex justify="center" style="flex: 1; margin-bottom: 20px">
        <animated-circle :ref="(e: any) => circleRefs[language] = markRaw(e)" :color="color" :size="`${size}px`" />
      </flex>
      <animated-number class="number" :value="count" comma />
      <span class="language">{{language}}</span>
    </flex>
  </flex>
</template>
<script lang="ts" setup>
import { watchLanguageStore } from "@/store";
import { computed, onBeforeUnmount, reactive, ref, markRaw, watch } from "vue";
import Flex from "@/components/ui/flex.vue";
import AnimatedCircle from "@/components/ui/animated-circle/animated-circle.vue";
import AnimatedNumber from '@/components/ui/animated-number';

const useLanguages = watchLanguageStore('watchLanguage');

const store = useLanguages();
const circleRefs = reactive({} as Record<string, { in (cnt: number): void, out (cnt: number): void }>);
const languageCount: Record<string, number> = reactive({});

watch(store.firstMessage, fm => {
  if (fm) {
    Object.entries(fm.languageMap).forEach(([lang, count]) => {
      languageCount[lang] = parseInt(count);
    });
  }
});

const sortedLanguage = computed(() =>
    Object.entries(languageCount)
        .map(([language, count]) => ({
          language,
          count,
        }))
        .sort((a, b) => b.count - a.count),
);

const top8 = computed(() => sortedLanguage.value.slice(0, 6).map(({ language, count }, i) => ({
  language,
  count,
  size: Math.pow(count, 1 / 2),
  color: `var(--c${i + 1})`
})));


const s = store.stream.subscribe(item => {
  Object.entries(item.additions).forEach(([lang, count]) => {
    languageCount[lang] = (languageCount[lang] ?? 0) + parseInt(count);
    circleRefs[lang]?.in(parseInt(count));
  });
  Object.entries(item.deletions).forEach(([lang, count]) => {
    languageCount[lang] = Math.max(0, (languageCount[lang] ?? 0) - parseInt(count));
    circleRefs[lang]?.out(parseInt(count));
  });
});

onBeforeUnmount(() => {
  s.unsubscribe();
});
</script>
<style scoped>
.number {
  font-family: monospace;
  font-size: 16px;
}
.language {
  font-weight: bold;
  font-size: 18px;
}
</style>