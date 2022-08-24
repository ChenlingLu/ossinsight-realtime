import { DemoEngine, UpdateCurrentNumberEvent, UpdateTooltipEvent } from "@/demo";
import { markRaw, ref, Ref, shallowReadonly, watchEffect } from "vue";
import { useCSS2DObject } from "@/components/hooks/css2d";
import Tooltip from "@/components/tooltip.vue";
import Numbers from "@/components/numbers.vue";
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
  const tooltip = useCSS2DObject(Tooltip, { date: '', value: 0, isToday: true, floor: 0 });
  const numbers = useCSS2DObject(Numbers, { text: '' });
  const todayNumber = ref(0);
  const log = createDebugLogger('demo-engine');

  watchEffect((onCleanup) => {
    const engine = engineRef.value;
    if (engine) {
      tooltip.container.value = engine.tooltip!.element;
      numbers.container.value = engine.numbers!.element;

      const tooltipUpdateHandler = (event: UpdateTooltipEvent) => {
        tooltip.props.date = event.date;
        tooltip.props.value = event.value;
        tooltip.props.isToday = event.isToday;
        tooltip.props.floor = event.floor;
      };

      const updateCurrentNumber = (event: UpdateCurrentNumberEvent) => {
        todayNumber.value = event.value;
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
    todayNumber,
    CSSElements: makeVNodesRenderer([tooltip.vnode, numbers.vnode]),
  };
}
