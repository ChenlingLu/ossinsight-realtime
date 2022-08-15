import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export function createTooltip(document: Document) {
  const tooltip = document.createElement('div');
  const content = document.createElement('div');
  tooltip.style.height = '126px';
  content.style.background = 'rgba(0, 0, 0, 0.4)';
  content.style.borderRadius = '4px';
  content.style.padding = '4px 8px';
  content.style.paddingBottom = '12px';
  content.style.whiteSpace = 'pre-wrap';
  content.style.color = 'white';
  content.style.clipPath = 'polygon(0 0, 0 calc(100% - 8px), calc(50% - 4px) calc(100% - 8px), 50% 100%, calc(50% + 4px) calc(100% - 8px), 100% calc(100% - 8px), 100% 0, 0 0)'
  content.style.fontSize = '16px';
  tooltip.appendChild(content);
  const object = new CSS2DObject(tooltip);

  return {
    rendered: false,
    element: tooltip,
    object,
    update: (text: string) => {
      content.innerText = text;
    },
  };
}
