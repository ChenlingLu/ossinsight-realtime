import { MixerEvent, SceneEvent } from "@/engine/events";
import {
  AnimationAction,
  AnimationBlendMode,
  AnimationClip,
  AnimationObjectGroup,
  Color,
  EventDispatcher,
  FogBase,
  Material,
  Object3D,
  Texture,
} from "three";

declare module 'three' {

  export class Scene extends Object3D<SceneEvent> {
    constructor();

    type: 'Scene';
    fog: FogBase | null;
    overrideMaterial: Material | null;
    autoUpdate: boolean;
    background: null | Color | Texture;
    environment: null | Texture;
    readonly isScene: true;

    toJSON(meta?: any): any;
  }

  export class AnimationMixer extends EventDispatcher<MixerEvent> {
    constructor(root: Object3D | AnimationObjectGroup);

    time: number;
    timeScale: number;

    clipAction(
      clip: AnimationClip,
      root?: Object3D | AnimationObjectGroup,
      blendMode?: AnimationBlendMode,
    ): AnimationAction;

    existingAction(clip: AnimationClip, root?: Object3D | AnimationObjectGroup): AnimationAction | null;

    stopAllAction(): AnimationMixer;

    update(deltaTime: number): AnimationMixer;

    setTime(timeInSeconds: number): AnimationMixer;

    getRoot(): Object3D | AnimationObjectGroup;

    uncacheClip(clip: AnimationClip): void;

    uncacheRoot(root: Object3D | AnimationObjectGroup): void;

    uncacheAction(clip: AnimationClip, root?: Object3D | AnimationObjectGroup): void;
  }
}
