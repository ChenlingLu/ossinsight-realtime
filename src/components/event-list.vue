<template>
  <list class="list" :el-ref="(el: HTMLElement) => containerRef = el">
    <transition-group name="list">
      <li v-for="(event, i) in realtimeEvents" :key="event.id" :ref="el => refEl(i, el)">
        <Event :event="event" />
      </li>
    </transition-group>
  </list>
</template>
<script lang="ts" setup>
import List from "./ui/list.vue";
import Event from "./ui/event.vue";
import { markRaw, reactive, ref, watch, watchEffect } from "vue";
import { useActive } from "./hooks/lifecycle";
import { FilteredEvent } from "@/store/poll";
import { bufferTime, filter, Subject } from "rxjs";
import { languages } from "./ui/lang";
import { ConnectionSource, RawSamplingFirstMessage } from "@/api/poll";

const allPass = (_: FilteredEvent) => true;

const elements = reactive<(HTMLElement | undefined)[]>([]);
const containerRef = ref<HTMLElement>();
const realtimeEvents = reactive<FilteredEvent[]>([]);
const eventFilter = ref(allPass);
const active = useActive();

const subject = new Subject<FilteredEvent>();

const props = defineProps<{
  stream: ConnectionSource<FilteredEvent, RawSamplingFirstMessage>,
  language: string,
  repo: string,
  play: boolean,
  excludeBots: boolean,
}>();

const refEl = (i: number, el: any) => {
  elements[i] = el ? markRaw(el) : undefined;
};

subject.pipe(bufferTime(300)).subscribe(items => {
  if (props.play) {
    realtimeEvents.unshift(...items);
  }
});

watchEffect((onCleanup) => {
  if (active.value) {
    const subscription = props.stream
        .pipe(filter(eventFilter.value))
        .subscribe(subject);
    onCleanup(() => subscription.unsubscribe());
  }
});

watch(elements, elements => {
  const container = containerRef.value;
  if (!container) {
    return;
  }
  const { bottom: parentBottom } = container.getBoundingClientRect();
  if (elements.length > 0) {
    let i = elements.length - 1;
    while (i >= 0) {
      const last = elements[i];
      if (!last) {
        return;
      }
      const { bottom } = last.getBoundingClientRect();
      if (bottom >= parentBottom + 32) {
        realtimeEvents.splice(i, 1);
        i--;
      } else {
        break;
      }
    }
  }
}, { immediate: false, flush: 'post' });

const BOT_REGEXP = /(?:robot|bot|\[bot])$/i

watch([() => props.language, () => props.repo, () => props.excludeBots], ([language, repo, excludeBots]) => {
  repo = repo.toLowerCase().trim();
  let filters: (typeof allPass)[] = [];
  if (language === 'Others') {
    filters.push(ev => {
      const lang = ev.language;
      for (let exists of languages) {
        if (lang === exists) {
          return false;
        }
      }
      return true;
    });
  } else if (language !== 'Any Language') {
    filters.push(ev => ev.language === language);
  }

  if (repo !== '') {
    filters.push(ev => ev.actorLogin.toLowerCase().indexOf(repo) !== -1 || ev.repoName.toLowerCase().indexOf(repo) !== -1);
  }

  if (excludeBots) {
    filters.push(ev => !BOT_REGEXP.test(ev.actorLogin))
  }

  if (filters.length === 0) {
    eventFilter.value = allPass;
  } else {
    eventFilter.value = (i: FilteredEvent) => {
      for (const filter of filters) {
        if (!filter(i)) {
          return false;
        }
      }
      return true;
    };
  }
}, { immediate: true });

watch(eventFilter, (filter) => {
  const filtered = realtimeEvents.filter(filter);
  if (filtered.length !== realtimeEvents.length) {
    realtimeEvents.splice(0, realtimeEvents.length, ...filtered);
  }
});

</script>
<style scoped>
.list {
  width: 100%;
  flex: 1;
  overflow: hidden;
  position: relative;
  margin: 16px;
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.2s linear;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>