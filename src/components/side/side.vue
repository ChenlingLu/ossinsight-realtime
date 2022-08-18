<template>
  <flex class="container">
    <flex class="banner">
      <h2 class="banner-title">
        <span>
          Total Pull Request Events in GitHub World since 2011
        </span>
        <flex direction="row" justify="center" align="center" style="margin-top: 8px">
          <Dot :color="colorMap[state]" style="margin-right: 4px" />
          <span class="numbers">
            {{ number }}
          </span>
        </flex>
      </h2>
    </flex>
    <hr class="divider"/>
    <flex class="info" direction="row" justify="space-between">
      <h2>Real-Time Events</h2>
      <a href="#">🤖️ how to make it</a>
    </flex>
    <list class="list" :el-ref="(el: HTMLElement) => containerRef = el">
      <transition-group name="list">
        <li v-for="(event, i) in realtimeEvents" :key="event.id" :ref="el => refEl(i, el)">
          <Event :event="event" />
        </li>
      </transition-group>
    </list>
    <hr class="divider" />
    <flex class="info" direction="row" justify="center">
      <span style="color: #7c7c7c; font-size: 16px">Powered by</span>
      &nbsp;
      &nbsp;
      <img src="/logos/tidbcloud.png" alt="TiDB Cloud" height="20" />
      &nbsp;
      <img src="/logos/pulsar.png" alt="Pulsar" height="20" />
    </flex>
  </flex>
</template>
<script setup lang="ts">
import Flex from "../ui/flex.vue";
import { useEvents } from "../../store";
import { computed, markRaw, reactive, ref, watch } from "vue";
import List from "../ui/list.vue";
import { FilteredEvent, prEventsPollStore, process } from "../../store/poll";
import Event from "../ui/event.vue";
import { subscribeOnVisible } from "../hooks/observable";
import Dot from "../ui/dot.vue";
import { ConnectionState } from "../../api/poll";
import { bufferTime, Subject } from "rxjs";

const usePrEvents = prEventsPollStore('pullRequestEvents');

const events = useEvents();
const prEvents = usePrEvents();
const realtimeEvents = reactive<FilteredEvent[]>([]);
const total = ref(0);
const state = ref(ConnectionState.CONNECTING);
const elements = reactive<(HTMLElement | undefined)[]>([]);
const containerRef = ref<HTMLElement>();

const refEl = (i: number, el: any) => {
  elements[i] = el ? markRaw(el) : undefined;
};

const colorMap = {
  [ConnectionState.ERROR]: 'red',
  [ConnectionState.CLOSED]: 'gray',
  [ConnectionState.CONNECTING]: 'yellow',
  [ConnectionState.CONNECTED]: '#34A352',
};

prEvents.stream.onStateChange(newState => state.value = newState);

const subject = new Subject<FilteredEvent>();

subscribeOnVisible(() => prEvents.stream, (container) => {
  // why need this?
  if (container) {
    return event => {
      total.value++;
      subject.next(markRaw(process(event)));
    };
  }
}, containerRef);

subject.pipe(bufferTime(300)).subscribe(items => {
  realtimeEvents.unshift(...items);
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

const number = computed(() => (events.total + total.value).toLocaleString('en'))

</script>
<style scoped lang="less">
.container {
  height: 100%;
  box-sizing: border-box;
  margin: 0 16px;
}

.banner {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  margin: 16px;
  &:before {
    display: block;
    content: ' ';
    z-index: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(95.09deg, #34A352 1.97%, #0085FF 94.72%);
    opacity: 0.15;
    border-radius: 6px;
  }
  &-title {
    text-align: center;
    font-size: 14px;
    font-weight: normal;

    .numbers {
      font-size: 24px;
      font-weight: bold;
    }
  }
}

.divider {
  width: 100%;
  border: none;
  height: 1px;
  background: #e5e5e5;
}

.info {
  width: 100%;
  padding: 16px 0;

  h2 {
    font-size: 18px;
    font-weight: normal;
    color: #2c2c2c;
    line-height: 1;
    margin: 0;
  }

  a {
    color: #abaaaa !important;
    text-decoration: none;
    font-size: 12px;
  }
}

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