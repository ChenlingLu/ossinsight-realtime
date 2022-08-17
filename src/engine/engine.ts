import { setup } from "./setup";
import { Camera, DefaultLoadingManager, EventDispatcher, Object3D, Scene, TextureLoader, WebGLRenderer } from "three";
import { AnimationMixerSet, UpdatableSet } from "./updatables";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { isMesh } from "./utils";
import { dispose } from "./dispose";

DefaultLoadingManager.setURLModifier(url => {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
});

export class Engine extends EventDispatcher {
  camera!: Camera;
  controls!: OrbitControls;
  scene!: Scene;
  renderer!: WebGLRenderer;
  renderer2d!: CSS2DRenderer;
  running: boolean;
  start!: () => void;
  stop!: () => void;
  mixers!: AnimationMixerSet;
  updatables!: UpdatableSet;
  interactables!: Set<Object3D>;
  gltfLoader: GLTFLoader;
  textureLoader: TextureLoader;

  constructor(public window: Window, public canvas: HTMLCanvasElement, public container?: HTMLElement) {
    super();
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new TextureLoader();
    this.running = false;
  }

  setup() {
    const {
      scene,
      start,
      stop,
      animationMixers,
      interactables,
      renderer,
      renderer2d,
      camera,
      controls,
      updatables,
    } = setup(this.window, this.canvas, this.container);
    this.scene = scene;
    this.start = () => {
      this.running = true;
      start();
    };
    this.stop = () => {
      this.running = false;
      stop()
    };
    this.mixers = animationMixers;
    this.updatables = updatables;
    this.interactables = interactables;
    this.renderer = renderer;
    this.renderer2d = renderer2d;
    this.camera = camera;
    this.controls = controls;
  }

  dispose() {
    this.stop()
    this.renderer.dispose();
    this.mixers.clear();
    this.updatables.clear();
    this.camera.removeFromParent();
    this.controls.dispose();
    dispose(this.scene);
  }
}