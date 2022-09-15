<template>
  <flex class="description" full-width direction="row" justify="space-between">
    <span>
      Events triggered by developers when they open/merge/close a pull request.
    </span>
    <span>
      Time Range: last hour ~ now
    </span>
  </flex>
  <flex ref="el" style="margin-top: 32px; flex: 1" full-width direction="column" justify="space-around">
    <flex v-for="i in [0, 1]" direction="row" justify="space-around" align="center" full-width>
      <div v-for="{ language, count, color, size } in languages.slice(i * 6, (i + 1) * 6)" :key="language"
           style="position: relative" :style="{ width: `${size}px`, height: `${size}px` }">
        <flex justify="center" style="flex: 1; margin-bottom: 20px">
          <animated-circle :ref="(e: any) => circleRefs[language] = markRaw(e)" :color="color" :size="size" />
        </flex>
        <flex class="bubble-text" style="position: absolute; left: 0; top: 0" full-height full-width justify="center">
          <animated-number class="number" :value="count" comma />
          <span class="language">{{ language }}</span>
        </flex>
      </div>
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

const gridSize = computed(() => {
  const { width = 600, height = 200 } = elSize.value ?? {};
  const max = Math.min(width / 6, height / 2);
  return {
    max,
    min: max * 0.35,
  };
});

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

const LANGUAGES = new Set(['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust', ' C++ ', 'C# ', 'PHP', 'Ruby', 'C#', 'C++', 'HTML', 'Shell']);

const languages = computed(() => {
  let array = sortedLanguage.value;
  const max = array[0].count;
  const min = array[array.length - 1].count;
  return array
      .map(({ language, count }, i) => ({
        language,
        count,
        size: gridSize.value.min + (gridSize.value.max - gridSize.value.min) * Math.pow((count - min) / (max - min), 2),
        color: `var(--c${i + 1})`,
      }))
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

.bubble-text {
  text-shadow: 1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
  white-space: nowrap;
}
</style>