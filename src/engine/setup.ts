import { Object3D, Scene } from "three";
import { createCamera } from "./camera";
import { createRenderer } from "./renderer";
import { createControls } from "./controls";
import { setupLighting } from "./lighting";
import { createPostProcessing } from "./post_processing";
import { createAnimate } from "./animate";
import { setupDOMListeners } from "./dom_listeners";
import { AnimationMixerSet, UpdatableSet } from "./updatables";

export function setup(window: Window, canvas: HTMLCanvasElement) {
  const updatables = new UpdatableSet();
  const animationMixers = new AnimationMixerSet();
  const interactables = new Set<Object3D>();

  const scene = new Scene();
  const camera = createCamera(window);
  const { renderer, renderer2d } = createRenderer(window, window, canvas);
  const controls = createControls(camera, renderer);
  const { composer } = createPostProcessing(scene, camera, renderer);

  setupDOMListeners(window, window, canvas, scene, camera, renderer, renderer2d, interactables, composer);
  setupLighting(scene);

  const { start, stop } = createAnimate(scene, camera, composer, renderer2d, controls, animationMixers, updatables);

  return { scene, renderer, renderer2d, start, stop, animationMixers, updatables, interactables, camera, controls };
}
