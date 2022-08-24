import { AnimationAction, Event } from 'three';


export interface RemovedEvent extends Event {
  type: 'removed';
}

export interface AddedEvent extends Event {
  type: 'added';
}

export type BaseObjectEvent =
  AddedEvent |
  RemovedEvent;

export interface FocusBuildingEvent extends Event {
  type: 'focus';
  isCurrentBuilding?: true;
}

export type ObjectEvent =
  FocusBuildingEvent |
  BaseObjectEvent;

export interface FocusSceneEvent extends FocusBuildingEvent {
  data?: {
    week: number
    day: number
  };
}

export interface BlurSceneEvent extends Event {
  type: 'blur';
}

export type SceneEvent =
  FocusSceneEvent |
  BlurSceneEvent |
  BaseObjectEvent;

export interface TransitionFinishedEvent extends Event {
  type: 'finished';
}

export type TransitionEvent =
  TransitionFinishedEvent;

export interface MixerFinishedEvent extends Event {
  type: 'finished';
  action: AnimationAction;
  direction: 1 | -1;
}

export interface MixerLoopEvent extends Event {
  type: 'finished';
  action: AnimationAction;
  loopDelta: number;
}

export type MixerEvent =
  MixerFinishedEvent |
  MixerLoopEvent;
