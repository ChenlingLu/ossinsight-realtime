import { ACESFilmicToneMapping, PCFSoftShadowMap, sRGBEncoding, Vector2, WebGLRenderer } from "three";
import { getSize } from "./utils";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

export function createRenderer(window: Window, container: Window | HTMLElement, canvas: HTMLCanvasElement) {
  // 3d renderer
  const renderer = new WebGLRenderer({
    powerPreference: "high-performance",
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.autoClear = false;
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;

  const size = renderer.getDrawingBufferSize(new Vector2());

  // labels renderer
  const renderer2d = new CSS2DRenderer();
  renderer2d.setSize(size.x, size.y);
  renderer2d.domElement.style.position = 'absolute';
  renderer2d.domElement.style.top = '0';
  renderer2d.domElement.style.left = '0';
  renderer2d.domElement.style.pointerEvents = 'none';
  getContainerElement(container).appendChild(renderer2d.domElement);

  resizeRenderer(window, container, renderer, renderer2d);

  return { renderer, renderer2d, size };
}

export function resizeRenderer(window: Window, container: Window | HTMLElement, renderer: WebGLRenderer, renderer2d: CSS2DRenderer) {
  const containerSize = getSize(container);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(containerSize.width, containerSize.height);
  renderer2d.setSize(containerSize.width, containerSize.height);
}

function getContainerElement(container: HTMLElement | Window): HTMLElement {
  if (container instanceof Window) {
    return window.document.body;
  } else {
    return container;
  }
}