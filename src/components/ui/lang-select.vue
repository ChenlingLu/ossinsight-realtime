<template>
  <div class="select-container" :class="{ focused }">
    <span class="content">{{ props.modelValue }}</span>
    <input
        ref="input"
        class="search"
        @focus="focused = true"
        @blur="focused = false"
        :style="{ opacity: focused ? 1 : 0 }"
        placeholder="Search..."
        v-model="search"
        @keydown.down="keyboardFocused = Math.min((selectFocused ?? -1) + 1, filteredLanguages.length - 1); mouseFocused = undefined; scrollIfNeed(); mouseDisabled = true;"
        @keydown.up="keyboardFocused = Math.max((selectFocused ?? 1) - 1, 0); mouseFocused = undefined; scrollIfNeed(); mouseDisabled = true;"
        @keydown.enter="handleEnter"
    />
    <list
        class="lang-list"
        :class="{ show: focused }"
        :el-ref="(el: HTMLUListElement) => list = el"
    >
      <li
          class="lang"
          :class="{ focused: selectFocused === i }"
          v-for="(language, i) in filteredLanguages"
          :key="language"
          @click="emits('update:modelValue', language)"
          @mouseenter="handleMouseEnter(i)"
          @mouseleave="handleMouseLeave"
          @mousemove="handleMouseMove"
      >
        {{ language }}
      </li>
      <li class="no-data" v-if="!filteredLanguages.length">
        Not found
      </li>
    </list>

    <span class="arrow-down" :class="{ open: focused }" />
  </div>
</template>
<script lang="ts" setup>
import { languages } from "./lang";
import { computed, ref, watchEffect } from "vue";
import List from "@/components/ui/list.vue";

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits(['update:modelValue']);
const focused = ref(false);
const search = ref('');
const input = ref<HTMLInputElement>();
const list = ref<HTMLUListElement>();

const mouseDisabled = ref(false);
const mouseFocused = ref<number>();
const keyboardFocused = ref<number>();

const selectFocused = computed(() => mouseFocused.value || keyboardFocused.value);

const handleEnter = () => {
  if (typeof selectFocused.value === 'number') {
    emits('update:modelValue', filteredLanguages.value[selectFocused.value]);
    focused.value = false;
  }
};

const handleMouseMove = () => {
  mouseDisabled.value = false;
}

const handleMouseEnter = (i: number) => {
  if (!mouseDisabled.value) {
    mouseFocused.value = i;
    keyboardFocused.value = undefined;
  }
};

const handleMouseLeave = () => {
  if (!mouseDisabled.value) {
    mouseFocused.value = undefined;
    keyboardFocused.value = undefined;
  }
}

watchEffect(() => {
  if (focused.value) {
    search.value = '';
    mouseDisabled.value = false;
    mouseFocused.value = undefined;
    keyboardFocused.value = undefined;
  } else {
    input.value?.blur();
  }
});

const scrollIfNeed = () => {
  if (selectFocused.value && list.value) {
    list.value.children.item(selectFocused.value)?.scrollIntoView({ block: 'center' });
  }
};

const filteredLanguages = computed(() => {
  if (search.value) {
    return languages.filter(lang => lang.toLowerCase().indexOf(search.value.toLowerCase()) !== -1);
  } else {
    return languages;
  }
});

</script>
<style scoped lang="less">
.select-container {
  position: relative;
  font-family: -apple-system, "PingFang SC", "Helvetica", sans-serif;
  border: 1px solid #c7c7c780;
  background: white;
  padding: 8px;
  color: #2c2c2c;
  font-size: 14px;
  font-weight: 400;
  border-radius: 3px;
  min-width: 140px;
  height: 38px;
  box-sizing: border-box;
  transition: box-shadow .2s ease, border-color .2s ease;
}

.select-container.focused {
  box-shadow: 0 0 3px 0 #0085FF;
  border-color: #0085FF80;
}

.content {
  user-select: none;
}

.search {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  appearance: none;
  border: none;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 8px;
  color: #2c2c2c;
  font-size: 14px;
  font-weight: 400;
  outline: none;
}


.lang-list {
  position: absolute;
  top: 46px;
  left: 0;
  border-radius: 3px;
  background: white;
  border: 1px solid #c7c7c780;
  z-index: 1;
  max-height: 200px;
  min-width: 140px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  opacity: 0;
  transform: translateY(-10px);
  transition: all .2s ease;
}

.lang-list.show {
  opacity: 1;
  transform: translateY(0);
}

.lang {
  padding: 4px 8px;
  transition: background-color .1s ease;
  cursor: pointer;
}

.lang.focused {
  background: #0085FF20;
}

.no-data {
  display: flex;
  height: 48px;
  width: 100%;
  font-size: 16px;
  color: #7c7c7c;
  align-items: center;
  justify-content: center;
}

.arrow-down {
  position: absolute;
  right: 8px;
  top: calc(50% - 2px);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;

  border-top: 4px solid #7c7c7c;

  transition: transform .2s ease;
}

.arrow-down.open {
  transform: rotate(180deg);
}
</style>