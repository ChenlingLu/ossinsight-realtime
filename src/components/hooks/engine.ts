import { DemoEngine, UpdateCurrentNumberEvent, UpdateTooltipEvent } from "@/demo";
import { markRaw, reactive, ref, Ref, shallowReadonly, watchEffect } from "vue";
import { useCSS2DObject } from "@/components/hooks/css2d";
import Tooltip from "@/components/tooltip.vue";
import { makeVNodesRenderer } from "@/components/vnodes";
import { createDebugLogger } from "@/utils/debug";

export type EngineRef = Readonly<Ref<DemoEngine | undefined>>

export function useEngine(canvasRef: Ref<HTMLCanvasElement | undefined>, containerRef?: Ref<HTMLElement | undefined>): EngineRef {
  const engineRef = ref<DemoEngine | undefined>();

  watchEffect((onCleanup) => {
    const canvas = canvasRef.value;
    const container = containerRef?.value;

    if (canvas && container) {
      const window = canvas.ownerDocument.defaultView as Window;
      const engine = new DemoEngine(window, canvas, container ?? window);
      engine.setup();
      engineRef.value = markRaw(engine);
      onCleanup(() => {
        engine.dispose();
      });
    }
  });

  return shallowReadonly(engineRef);
}

export function useEngineCssElements(engineRef: EngineRef) {
  const tooltip = useCSS2DObject(Tooltip, { date: '', value: 0, isToday: true, floor: 0, developers: 0, merged: 0, opened: 0 });
  const today = reactive({
    events: 0,
    developers: 0,
    merged: 0,
    opened: 0,
  });
  const log = createDebugLogger('demo-engine');

  watchEffect((onCleanup) => {
    const engine = engineRef.value;
    if (engine) {
      tooltip.container.value = engine.tooltip!.element;

      const tooltipUpdateHandler = (event: UpdateTooltipEvent) => {
        tooltip.props.date = event.date;
        tooltip.props.value = event.value;
        tooltip.props.isToday = event.isToday;
        tooltip.props.floor = event.floor;
        tooltip.props.developers = event.developers;
        tooltip.props.merged = event.merged;
        tooltip.props.opened = event.opened;
      };

      const updateCurrentNumber = (event: UpdateCurrentNumberEvent) => {
        today.events = event.value;
        today.developers = event.developers;
        today.opened = event.opened;
        today.merged = event.merged;
        log('update today', event.value);
      };

      engine.addEventListener('update:tooltip', tooltipUpdateHandler);
      engine.addEventListener('update:current-number', updateCurrentNumber);

      onCleanup(() => {
        engine.removeEventListener('update:tooltip', tooltipUpdateHandler);
        engine.removeEventListener('update:current-number', updateCurrentNumber);
      });
    }
  });

  return {
    tooltip,
    today,
    CSSElements: makeVNodesRenderer([tooltip.vnode]),
  };
}
