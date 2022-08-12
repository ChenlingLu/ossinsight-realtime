import {
  AnimationClip,
  AnimationMixer,
  Color,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  VectorKeyframeTrack,
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTF_BOX, GLTF_ENVIRONMENT, GLTF_ENVIRONMENT_ANIMATED, GLTF_ENVIRONMENT_OBJECTS } from "./assets";
import { setShadow } from "./engine/shadow";
import { getCity } from "./city/algo";
import { renderShiftX, renderShiftY, renderShiftZ, renderTiles } from "./city/render";
import { DEFAULT_CURVE, genVec3Curve, randomNumber, randomVector3 } from "./city/seed";
import { makeVector3 } from "./engine/vectors";
import ObjectCache from "./engine/cache";
import { getData, transform } from "./api";
import { highlight } from "./engine/highlight";
import Engine from "./engine";
import { createSmoke } from "./engine/smoke";
import { FLOOR_HEIGHT } from "./city/constants";
import { createNumbers } from "./engine/numbers";
import { transitionVec3 } from "./utils/transition";

export class DemoEngine extends Engine {
  cache: ObjectCache<GLTF>;

  constructor(window: Window, canvas: HTMLCanvasElement) {
    super(window, canvas);
    this.cache = new ObjectCache<GLTF>(this.gltfLoader, GLTF_BOX);
  }

  async init() {
    this.scene.background = new Color(0x9ad0ec);

    const base = new Vector3(0, -4, 0);
    await Promise.all([
      this.add(GLTF_ENVIRONMENT, base, false, true),
      this.add(GLTF_ENVIRONMENT_OBJECTS, base, true, false),
      this.add(GLTF_ENVIRONMENT_ANIMATED, base, true, false),
    ]);

    const [data, rawData, [day, week]] = transform(await getData());

    const tiles = getCity(data, rawData);

    const groups = renderTiles(this.scene, this.gltfLoader, tiles, this.interactables);

    highlight(this.outlinePass, groups[day][week]);

    this.showNow(data, week, day);

    this.scene.addEventListener('focus', (e) => {
      if (e.group) {
        this.controls.autoRotate = e.data.event_day === rawData[day]?.[week]?.event_day;
      }
      const transition = transitionVec3(this.controls.target, e.group.children[0].position.clone().setY(0), 1.5, DEFAULT_CURVE)
      this.updatables.add(transition);
      transition.addEventListener('finished', ()=> {
        this.updatables.delete(transition)
      })
    });

    this.scene.addEventListener('blur', () => {
      highlight(this.outlinePass, groups[day][week]);
    });

    this.start();
  }

  async add(asset: string, position: Vector3, castShadow = false, receiveShadow = false) {
    const obj = await this.gltfLoader.loadAsync(asset);
    obj.scene.position.set(position.x, position.y, position.z);
    if (castShadow || receiveShadow) {
      setShadow(obj.scene, castShadow, receiveShadow);
    }
    if (obj.animations && obj.animations.length !== 0) {
      const mixer = new AnimationMixer(obj.scene);
      obj.animations.forEach(animation => {
        mixer.clipAction(animation).play();
      });
      this.mixers.add(mixer);
    }
    this.scene.add(obj.scene);
  }

  async addBrick(from: Vector3, to: Vector3, scale: number, color: Color, duration: number) {
    const obj = await this.cache.getOne();
    obj.scene.position.set(from.x, from.y, from.z);
    obj.scene.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360, 'XYZ')

    const mesh = <Mesh>obj.scene.getObjectByName('Mesh');
    const material = <MeshStandardMaterial>mesh.material;
    material.color.set(color);

    const mixer = new AnimationMixer(obj.scene);

    const [positionTimes, positions] = genVec3Curve(DEFAULT_CURVE, from, randomVector3(to, makeVector3(1)));
    const [scaleTimes, scales] = genVec3Curve(DEFAULT_CURVE, makeVector3(scale), makeVector3(0.3));

    const action = mixer.clipAction(new AnimationClip('brick-entrance', duration, [
      new VectorKeyframeTrack('.position', positionTimes.map(i => i * duration), positions.flatMap(vec3 => vec3.toArray())),
      new VectorKeyframeTrack('.scale', scaleTimes.map(i => i * duration), scales.flatMap(vec3 => vec3.toArray())),
    ]));
    action.setLoop(LoopOnce, 1);
    // action.clampWhenFinished = true;
    action.play();
    this.mixers.add(mixer);

    this.scene.add(obj.scene);

    // remove when animation done
    mixer.addEventListener('finished', () => {
      this.mixers.delete(mixer);
      this.scene.remove(obj.scene);
      this.cache.add(obj);
    });
  }

  showNow (data: number[][], week: number, day: number) {
    const pos = getPos(week, day, data[day][week] * FLOOR_HEIGHT * 2)

    // set camera
    this.controls.target.copy(pos);

    // create smoke
    const smoke = createSmoke(this.textureLoader, 'textures/smoke.png', this.mixers);
    smoke.scale.set(2, 2, 2);
    smoke.position.copy(pos);
    this.scene.add(smoke);

    // create numbers
    const numbers = createNumbers(window, 200, 200);
    numbers.mesh.position.copy(pos);
    numbers.mesh.scale.set(5, 5, 5);
    numbers.setValue(100);
    this.scene.add(numbers.mesh);
    let cur = 1000
    setInterval(() => {
      numbers.setValue(cur += Math.floor(1000 * Math.random()));
      numbers.mesh.material.needsUpdate = true;
    }, 1000);
    this.updatables.add(numbers);

    this.controls.addEventListener('change', () => {
      smoke.rotation.copy(this.camera.rotation);
      numbers.mesh.rotation.copy(this.camera.rotation);
    });

    // add bricks
    const fromPos = getPos(week, day).setY(40);
    const toPos = fromPos.clone().setY(data[day][week] * FLOOR_HEIGHT * 2);

    setInterval(() => {
      for (let i = 0; i < 10; i++) {
        const from = randomVector3(fromPos, new Vector3(25, 10, 25));
        const duration = randomNumber(2, 0.5);
        const scale = randomNumber(1, 0.4);
        const color = randomVector3(makeVector3(0), makeVector3(1));
        this.addBrick(from, toPos, scale, new Color(color.x, color.y, color.z), duration);
      }
    }, 100);

  }

}

export function getPos(week: number, day: number, h?: number) {
  return new Vector3(2 * (week + renderShiftX) * 1.1, -renderShiftZ + (h ?? 0), 2 * (day + renderShiftY) * 1.1);
}
