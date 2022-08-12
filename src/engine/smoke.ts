import {
  Color,
  Euler,
  Group, InterpolateLinear,
  LoopOnce,
  Mesh,
  MeshLambertMaterial, NormalAnimationBlendMode,
  NumberKeyframeTrack,
  PlaneGeometry, Quaternion, QuaternionKeyframeTrack,
  TextureLoader,
  Vector3,
  VectorKeyframeTrack,
} from "three";
import { AnimationMixerSet } from "./updatables";
import { makeAnimation } from "./animations";
import { randomVector3 } from "../city/seed";
import { makeVector3 } from "./vectors";

export function createSmoke(loader: TextureLoader, smokeAsset: string, mixers: AnimationMixerSet) {
  const texture = loader.load(smokeAsset);
  const geometry = new PlaneGeometry(1, 1);
  const material = new MeshLambertMaterial({
    map: texture,
    opacity: 0.7, transparent: true,
    emissive: new Color(0xffffff),
  });

  const group = new Group();

  const duration = 15;

  function create() {
    const element = new Mesh(geometry, material.clone());
    element.scale.set(1, 1, 1);
    element.position.copy(randomVector3(makeVector3(0), makeVector3(0.5)));
    group.add(element);

    const from = element.position
    const to = from.clone().add(new Vector3(0.2 * Math.random(), 3 * Math.random(), 0.2 * Math.random()))

    const s = Math.random() * 360;
    const qInitial = new Quaternion().setFromEuler(new Euler(0, 0, s, 'XYZ'));
    const qFinal = new Quaternion().setFromEuler(new Euler(0, 0, s + Math.random() * 360, 'XYZ'));

    makeAnimation(mixers, element, 'smoke', duration, [
      new VectorKeyframeTrack('.position', [0, duration], [from, to].flatMap(vec => vec.toArray())),
      new NumberKeyframeTrack('.material.opacity', [0, duration * 0.4, duration * 0.6, duration], [0, 0.9, 0.9, 0], InterpolateLinear),
      new QuaternionKeyframeTrack('.quaternion', [0, duration], [qInitial, qFinal].flatMap(q => q.toArray()))
    ], NormalAnimationBlendMode).setLoop(LoopOnce, 1).play();
  }

  setInterval(() => {
    create();
  }, 300);

  return group;
}