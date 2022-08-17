import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export function createPlaceholder(document: Document): { rendered: boolean; element: HTMLDivElement; object: CSS2DObject } {
  const tooltip = document.createElement('div');
  const object = new CSS2DObject(tooltip);

  return {
    rendered: false,
    element: tooltip,
    object,
  };
}
