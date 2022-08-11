import {
  AnimationClip,
  AnimationMixer,
  Color,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Scene,
  Vector3,
  VectorKeyframeTrack,
} from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTF_BOX, GLTF_ENVIRONMENT, GLTF_ENVIRONMENT_ANIMATED, GLTF_ENVIRONMENT_OBJECTS } from "./assets";
import { AnimationMixerSet } from "./engine/updatables";
import { setShadow } from "./engine/shadow";
import { getCity } from "./city/algo";
import { renderShiftX, renderShiftY, renderShiftZ, renderTiles } from "./city/render";
import { DEFAULT_CURVE, genVec3Curve, randomNumber, randomVector3 } from "./city/seed";
import { makeVector3 } from "./engine/vectors";
import ObjectCache from "./engine/cache";
import { getData, transform } from "./api";
import { highlight } from "./engine/highlight";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";


export function getPos(week: number, day: number) {
  return new Vector3(2 * (week + renderShiftX) * 1.1, -renderShiftZ, 2 * (day + renderShiftY) * 1.1);
}

export async function demo(scene: Scene, outlinePass: OutlinePass, mixers: AnimationMixerSet, interactables: Set<Object3D>) {
  scene.background = new Color(0x9ad0ec);
  const loader = new GLTFLoader();
  const cache = new ObjectCache<GLTF>(loader, GLTF_BOX);

  // scene.background = new Color(0x9ad0ec);
  const base = new Vector3(0, -4, 0);
  await Promise.all([
    // addBox(scene, mixers),
    add(scene, mixers, loader, GLTF_ENVIRONMENT, base, false, true),
    add(scene, mixers, loader, GLTF_ENVIRONMENT_OBJECTS, base, true, false),
    add(scene, mixers, loader, GLTF_ENVIRONMENT_ANIMATED, base, true, false),
  ]);

  const [data, rawData, [day, week]] = transform(await getData());

  const tiles = getCity(data, rawData);

  const groups = renderTiles(scene, loader, tiles, interactables);

  highlight(outlinePass, groups[day][week]);

  const fromPos = getPos(week, day).setY(40);
  const toPos = fromPos.clone().setY(5);

  setInterval(() => {
    for (let i = 0; i < 10; i++) {
      const from = randomVector3(fromPos, new Vector3(25, 10, 25));
      const duration = randomNumber(2, 0.5);
      const scale = randomNumber(1, 0.4);
      const color = randomVector3(makeVector3(0), makeVector3(1));
      addBrick(scene, mixers, cache, from, toPos, scale, new Color(color.x, color.y, color.z), duration);
    }
  }, 100);

  scene.addEventListener('focus', (e) => {
    console.log(e.data);
  });
  scene.addEventListener('blur', () => {
    highlight(outlinePass, groups[day][week]);
  });
}

async function add(scene: Scene, mixers: AnimationMixerSet, loader: GLTFLoader, asset: string, position: Vector3, castShadow = false, receiveShadow = false) {
  const obj = await loader.loadAsync(asset);
  obj.scene.position.set(position.x, position.y, position.z);
  if (castShadow || receiveShadow) {
    setShadow(obj.scene, castShadow, receiveShadow);
  }
  if (obj.animations && obj.animations.length !== 0) {
    const mixer = new AnimationMixer(obj.scene);
    obj.animations.forEach(animation => {
      mixer.clipAction(animation).play();
    });
    mixers.add(mixer);
  }
  scene.add(obj.scene);
}

async function addBrick(scene: Scene, mixers: AnimationMixerSet, cache: ObjectCache<GLTF>, from: Vector3, to: Vector3, scale: number, color: Color, duration: number) {
  const obj = await cache.getOne();
  obj.scene.position.set(from.x, from.y, from.z);

  const mesh = <Mesh>obj.scene.getObjectByName('Mesh');
  const material = <MeshStandardMaterial>mesh.material;
  material.color.set(color);

  const mixer = new AnimationMixer(obj.scene);

  const [positionTimes, positions] = genVec3Curve(DEFAULT_CURVE, from, to);
  const [scaleTimes, scales] = genVec3Curve(DEFAULT_CURVE, makeVector3(scale), makeVector3(0));

  const action = mixer.clipAction(new AnimationClip('brick-entrance', duration, [
    new VectorKeyframeTrack('.position', positionTimes.map(i => i * duration), positions.flatMap(vec3 => vec3.toArray())),
    new VectorKeyframeTrack('.scale', scaleTimes.map(i => i * duration), scales.flatMap(vec3 => vec3.toArray())),
  ]));
  action.setLoop(LoopOnce, 1);
  // action.clampWhenFinished = true;
  action.play();
  mixers.add(mixer);

  scene.add(obj.scene);

  // remove when animation done
  mixer.addEventListener('finished', () => {
    mixers.delete(mixer);
    scene.remove(obj.scene);
    cache.add(obj);
  });
}
