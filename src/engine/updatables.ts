import { AnimationMixer } from "three";

export interface Updatable {
  update(delta?: number): void;
}

export class AnimationMixerSet extends Set<AnimationMixer> implements Updatable {
  update(delta: number) {
    this.forEach(mixer => mixer.update(delta));
  }
}
