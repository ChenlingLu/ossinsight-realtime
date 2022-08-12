import { AnimationBlendMode, AnimationClip, AnimationMixer, Object3D } from "three";
import { KeyframeTrack } from "three/src/animation/KeyframeTrack";
import { AnimationMixerSet } from "./updatables";

export function makeAnimation(mixers: AnimationMixerSet, target: Object3D, name?: string, duration?: number, tracks?: KeyframeTrack[], blendMode?: AnimationBlendMode, remove: boolean = true) {
  const mixer = new AnimationMixer(target);
  const clip = new AnimationClip(name, duration, tracks, blendMode);
  mixer.addEventListener('finished', () => {
    mixers.delete(mixer);
    if (remove) {
      target.removeFromParent();
    }
  });
  mixers.add(mixer);
  return mixer.clipAction(clip);
}