import { setup } from "./setup";
import { Camera, DefaultLoadingManager, Object3D, Scene, TextureLoader, WebGLRenderer } from "three";
import { AnimationMixerSet, UpdatableSet } from "./updatables";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

DefaultLoadingManager.setURLModifier(url => {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
});

export class Engine {
  camera!: Camera;
  controls!: OrbitControls;
  scene!: Scene;
  renderer!: WebGLRenderer;
  start!: () => void;
  stop!: () => void;
  mixers!: AnimationMixerSet;
  updatables!: UpdatableSet;
  interactables!: Set<Object3D>;
  outlinePass!: OutlinePass;
  gltfLoader: GLTFLoader;
  textureLoader: TextureLoader;

  constructor(public window: Window, public canvas: HTMLCanvasElement) {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new TextureLoader();
  }

  setup() {
    const {
      scene,
      start,
      stop,
      animationMixers,
      interactables,
      outlinePass,
      renderer,
      camera,
      controls,
      updatables,
    } = setup(this.window, this.canvas);
    this.scene = scene;
    this.start = start;
    this.stop = stop;
    this.mixers = animationMixers;
    this.updatables = updatables;
    this.interactables = interactables;
    this.outlinePass = outlinePass;
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;
  }
}