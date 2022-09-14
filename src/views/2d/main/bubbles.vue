<template>
  <flex class="description" full-width direction="row" justify="space-between">
    <span>
      Events triggered by developers when they open/merge/close a pull request.
    </span>
    <span>
      Time Range: last hour ~ now
    </span>
  </flex>
  <flex ref="el" direction="row" justify="space-around" align="stretch" full-width style="margin-top: 32px">
    <flex v-for="{ language, count, color, size } in languages" :key="language">
      <flex justify="center" style="flex: 1; margin-bottom: 20px">
        <animated-circle :ref="(e: any) => circleRefs[language] = markRaw(e)" :color="color" :size="size" />
      </flex>
      <animated-number class="number" :value="count" comma />
      <span class="language">{{ language }}</span>
    </flex>
  </flex>
</template>
<script lang="ts" setup>
import { useSize, watchLanguageStore } from "@/store";
import { computed, markRaw, onBeforeUnmount, reactive, ref, watch } from "vue";
import Flex from "@/components/ui/flex.vue";
import AnimatedCircle from "@/components/ui/animated-circle/animated-circle.vue";
import AnimatedNumber from '@/components/ui/animated-number';
import { useElementSize } from "@/components/hooks/element-size";

const useLanguages = watchLanguageStore('watchLanguage');

const store = useLanguages();
const size = useSize();
const circleRefs = reactive({} as Record<string, { in(cnt: number): void, out(cnt: number): void }>);
const languageCount: Record<string, number> = reactive({});
const el = ref<{ el: HTMLElement }>();
const elSize = useElementSize(computed(() => el.value?.el));

watch(store.firstMessage, fm => {
  if (fm) {
    Object.entries(fm.languageMap).forEach(([lang, count]) => {
      languageCount[lang] = parseInt(count);
    });
  }
});

const sortedLanguage = computed(() =>
    Object.entries(languageCount)
        .filter(([language]) => LANGUAGES.has(language))
        .map(([language, count]) => ({
          language,
          count,
        }))
        .sort((a, b) => b.count - a.count),
);

const LANGUAGES = new Set(['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust', ' C++ ', 'C# ', 'PHP', 'Ruby']);

const len = computed(() => {
  if (elSize.value) {
    return Math.floor(elSize.value?.width / 80);
  } else {
    return LANGUAGES.size;
  }
});

const languages = computed(() => {
  let array = sortedLanguage.value;
  const max = array[0].count;
  const min = array[array.length - 1].count;
  return array
      .map(({ language, count }, i) => ({
        language,
        count,
        size: 10 + 70 * Math.pow((count - min) / (max - min), 2),
        color: `var(--c${i + 1})`,
      }))
      .slice(0, len.value);
});


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
.description {
  color: var(--text-secondary);
  padding: 0 16px;
}

.number {
  font-family: monospace;
  font-size: 16px;
  color: var(--text-secondary);
}

.language {
  font-weight: bold;
  font-size: 14px;
}
</style>