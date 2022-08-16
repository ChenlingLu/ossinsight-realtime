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
import { getData, RawData, transform } from "./api";
import { highlight } from "./engine/highlight";
import Engine from "./engine";
import { createSmoke } from "./engine/smoke";
import { FLOOR_HEIGHT, INIT_CONTRIBUTIONS } from "./city/constants";
import { createNumbers } from "./engine/numbers";
import { transitionVec3 } from "./utils/transition";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { createPlaceholder } from "./engine/html-placeholder";
import { GithubEvent } from "./api/poll";

export class DemoEngine extends Engine {
  cache: ObjectCache<GLTF>;
  tooltip?: ReturnType<typeof createPlaceholder>;
  week: number = 0;
  day: number = 0;
  data: number[][] = INIT_CONTRIBUTIONS;
  numbersCanvas?: ReturnType<typeof createNumbers>;
  bricks: number = 0;

  constructor(window: Window, canvas: HTMLCanvasElement, container?: HTMLElement) {
    super(window, canvas, container);
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

    this.data = data;
    this.week = week;
    this.day = day;

    const tiles = getCity(data, rawData);

    const groups = renderTiles(this.scene, this.gltfLoader, tiles, this.interactables);

    highlight(groups[day][week]);

    this.setNow(data, week, day);

    this.tooltip = createPlaceholder(this.window.document);

    this.scene.addEventListener('focus', (e) => {
      if (!e.data) {
        return;
      }
      if (e.data) {
        this.controls.autoRotate = e.data.week === week && e.data.day === day;
        this.showTooltip(e.data.week, e.data.day, rawData);
      }
      const controlPositionTransition = transitionVec3(this.controls.target, e.group.children[0].position.clone().setY(0), 1.5, DEFAULT_CURVE);
      this.updatables.add(controlPositionTransition);
      controlPositionTransition.addEventListener('finished', () => {
        this.updatables.delete(controlPositionTransition);
      });
    });

    this.scene.addEventListener('blur', () => {
      highlight(groups[day][week]);
      this.hideTooltip();
      this.controls.autoRotate = true;
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

  setNow(data: number[][], week: number, day: number) {
    const pos = getPos(week, day, data[day][week] * FLOOR_HEIGHT * 2);

    // set camera
    this.controls.target.copy(pos);

    // create smoke
    const smoke = createSmoke(this.textureLoader, 'textures/smoke.png', this.mixers);
    smoke.scale.set(2, 2, 2);
    smoke.position.copy(pos);
    this.scene.add(smoke);
    this.controls.addEventListener('change', () => {
      smoke.rotation.copy(this.camera.rotation);
    });

    // create numbers
    const numbersCanvas = this.numbersCanvas = createNumbers(window.document, 26);
    const numbers = new CSS2DObject(numbersCanvas.numbers);
    numbers.position.copy(pos);
    numbers.position.y += 1.5;
    numbers.scale.set(5, 5, 5);
    numbersCanvas.setValue(data[day][week]);
    this.scene.add(numbers);

    // add base
    this.gltfLoader.load('models/building_base.glb', gltf => {
      gltf.scene.position.copy(pos);
      gltf.scene.position.setY(renderShiftZ);
      gltf.scene.scale.copy(makeVector3(0.6));
      this.scene.add(gltf.scene);
    });
  }

  showTooltip(week: number, day: number, rawData: (RawData | undefined)[][]) {
    if (!rawData) {
      return;
    }
    const { events, event_day } = rawData[day][week] ?? { events: 0, event_day: 'unknown' };
    const pos = getPos(week, day, events / 1000000 * 2);
    const tooltip = this.tooltip!;

    tooltip.update?.(`${fmt.format(new Date(event_day))}\n${events.toLocaleString('en')} events`);
    tooltip.object.position.copy(pos.clone().setY(pos.y));
    if (!tooltip.rendered) {
      this.scene.add(tooltip.object);
      tooltip.rendered = true;
    }
  }

  hideTooltip() {
    if (this.tooltip?.rendered) {
      this.tooltip.rendered = false;
      this.tooltip.object.removeFromParent();
    }
  }

  private async _addBrick(from: Vector3, to: Vector3, scale: number, color: Color, duration: number, cb: () => void) {
    const obj = await this.cache.getOne();
    obj.scene.position.set(from.x, from.y, from.z);
    obj.scene.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360, 'XYZ');

    const mesh = <Mesh>obj.scene.getObjectByName('Mesh');
    const material = <MeshStandardMaterial>mesh.material;
    material.color.set(color);

    const mixer = new AnimationMixer(obj.scene);

    const [positionTimes, positions] = genVec3Curve(DEFAULT_CURVE, from, randomVector3(to, makeVector3(1)));
    const [scaleTimes, scales] = genVec3Curve(DEFAULT_CURVE, makeVector3(scale), makeVector3(0));

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
      cb();
    });
  }

  addBrick(_event: GithubEvent) {
    // add bricks
    const fromPos = getPos(this.week, this.day).setY(40);
    const toPos = fromPos.clone().setY(this.data[this.day][this.week] * FLOOR_HEIGHT * 2);

    const from = randomVector3(fromPos, new Vector3(25, 10, 25));
    const duration = randomNumber(2, 0.5);
    const scale = randomNumber(1, 0.4);
    const color = randomVector3(makeVector3(0), makeVector3(1));
    this._addBrick(from, toPos, scale, new Color(color.x, color.y, color.z), duration, () => {
      this.bricks += 1;
      this.setCurrent(this.data[this.day][this.week] + this.bricks);
    });
  }

  setCurrent(val: number) {
    this.numbersCanvas?.setValue(val);
  }
}

export function getPos(week: number, day: number, h?: number) {
  return new Vector3(2 * (week + renderShiftX) * 1.1, -renderShiftZ + (h ?? 0), 2 * (day + renderShiftY) * 1.1);
}

const fmt = Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
