import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export function createPlaceholder<T = string>(document: Document): { rendered: boolean; update?: (text: T) => void; element: HTMLDivElement; object: CSS2DObject } {
  const tooltip = document.createElement('div');
  const object = new CSS2DObject(tooltip);

  return {
    rendered: false,
    element: tooltip,
    object,
  };
}
