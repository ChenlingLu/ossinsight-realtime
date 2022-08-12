import {
  ACESFilmicToneMapping,
  Camera,
  PCFSoftShadowMap,
  RGBAFormat,
  Scene,
  sRGBEncoding,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { getSize } from "./utils";

export function createRenderer(window: Window, container: Window | HTMLElement, canvas: HTMLCanvasElement, scene: Scene, camera: Camera) {
  const context = canvas.getContext('webgl2', { antialias: false });
  const renderer = new WebGLRenderer({
    powerPreference: "high-performance",
    canvas: canvas,
    context: context ?? undefined,
    alpha: true,
    antialias: false,
  });

  renderer.autoClear = false;
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;

  const size = renderer.getDrawingBufferSize(new Vector2());
  const target = new WebGLRenderTarget(size.x, size.y, {
    samples: 4,
    stencilBuffer: true,
    format: RGBAFormat,
    encoding: sRGBEncoding,
  });

  renderer.setRenderTarget(target);
  resizeRenderer(window, container, renderer, target);

  renderer.render(scene, camera);
  return { renderer, target, size };
}

export function resizeRenderer(window: Window, container: Window | HTMLElement, renderer: WebGLRenderer, target: WebGLRenderTarget) {
  const containerSize = getSize(container);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(containerSize.width, containerSize.height);

  const size = renderer.getDrawingBufferSize(new Vector2());
  target.setSize(size.x, size.y);
}
