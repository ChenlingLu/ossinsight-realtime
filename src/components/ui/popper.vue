<template>
  <span class="popper-anchor" ref="anchorRef" @mouseenter="show = true" @mouseleave="show = false">
    <slot name="label" />
  </span>
  <teleport to="body">
    <transition name="fade">
      <keep-alive>
        <div v-if="show" ref="popperRef" class="popper-content">
          <slot />
          <span class="popper-arrow" ref="arrowRef" />
        </div>
      </keep-alive>
    </transition>
  </teleport>
</template>
<script lang="ts" setup>
import { createPopper, Options, State } from "@popperjs/core";
import { defineProps, ref, watch } from "vue";

const show = ref(false);

const props = defineProps<{
  placement?: Options['placement'],
  strategy?: Options['strategy'],
  offset?: number,
}>();

const anchorRef = ref<HTMLElement>();
const popperRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();

const state = ref<State>();

watch([anchorRef, popperRef, arrowRef, props], ([anchor, popper, arrow, props], _, onCleanup) => {
  if (anchor && popper) {
    const { placement, strategy, offset = 8 } = props;
    const options: Options = {
      placement: 'auto',
      modifiers: [{
        name: 'arrow',
        options: {
          element: arrow,
          padding: 8,
        },
      }, {
        name: 'offset',
        options: {
          offset: [0, offset + 4],
        },
      }],
      strategy: 'fixed',
      onFirstUpdate: newState => {
        state.value = Object.assign({}, state.value, newState);
      },
    };
    if (placement) {
      options.placement = placement;
    }
    if (strategy) {
      options.strategy = strategy;
    }

    const popperInstance = createPopper(anchor, popper, options);

    state.value = popperInstance.state;

    onCleanup(() => {
      popperInstance.destroy();
    });
  }
});
</script>
<style scoped lang="less">
@import "../less/arrow";

@arrow-size: 4px;
@bg-color: #7c7c7c;

.popper-anchor {
  display: inline-block;
}

.popper-content {
  background: @bg-color;
  color: white;
  padding: 8px;
  border-radius: 4px;
  z-index: 100;
  transform-origin: right top;

  &[data-popper-placement=bottom], &[data-popper-placement=bottom-start], &[data-popper-placement=bottom-end] {
    .popper-arrow {
      top: -@arrow-size;
      .arrow-up(@arrow-size, @bg-color);
    }
  }

  &[data-popper-placement=top], &[data-popper-placement=top-start], &[data-popper-placement=top-end] {
    .popper-arrow {
      bottom: -@arrow-size;
      .arrow-down(@arrow-size, @bg-color);
    }
  }

  &[data-popper-placement=left], &[data-popper-placement=left-start], &[data-popper-placement=left-end] {
    .popper-arrow {
      right: -@arrow-size;
      .arrow-right(@arrow-size, @bg-color);
    }
  }

  &[data-popper-placement=right], &[data-popper-placement=right-start], &[data-popper-placement=right-end] {
    .popper-arrow {
      left: -@arrow-size;
      .arrow-left(@arrow-size, @bg-color);
    }
  }
}

.popper-arrow {
  display: block;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-active {
  opacity: 0;
}

.fade-enter-to, .fade-leave-active {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

</style>