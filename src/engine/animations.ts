import { AnimationBlendMode, AnimationClip, AnimationMixer, LoopOnce, Object3D } from "three";
import { KeyframeTrack } from "three/src/animation/KeyframeTrack";
import { AnimationMixerSet } from "./updatables";
import { dispose } from "./dispose";
import { ObjectEvent } from "@/engine/events";
import { once } from "@/engine/utils";

export function makeAnimation(mixers: AnimationMixerSet, target: Object3D, name?: string, duration?: number, tracks?: KeyframeTrack[], blendMode?: AnimationBlendMode, remove: boolean = true) {
  const mixer = new AnimationMixer(target);
  const clip = new AnimationClip(name, duration, tracks, blendMode);
  once(mixer, 'finished', () => {
    mixers.delete(mixer);
    if (remove) {
      target.removeFromParent();
      dispose(target);
    }
  });
  mixers.add(mixer);
  return mixer.clipAction(clip);
}

export function makeTransition(mixers: AnimationMixerSet, target: Object3D<ObjectEvent>, name?: string, duration?: number, tracks?: KeyframeTrack[], blendMode?: AnimationBlendMode) {
  const action = makeAnimation(mixers, target, name, duration, tracks, blendMode, true);
  once(target, 'added', () => {
    action.setLoop(LoopOnce, 1).play();
  });
}