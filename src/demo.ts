import {
  AnimationMixer,
  BoxGeometry,
  Color,
  Euler,
  Event,
  Group,
  InterpolateLinear,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  NormalAnimationBlendMode,
  NumberKeyframeTrack,
  Object3D,
  PlaneGeometry,
  Quaternion,
  QuaternionKeyframeTrack,
  Vector3,
  VectorKeyframeTrack,
} from "three";
import { GLTF_ENVIRONMENT, GLTF_ENVIRONMENT_ANIMATED, GLTF_ENVIRONMENT_OBJECTS } from "./assets";
import { setShadow } from "./engine/shadow";
import { getCity } from "./city/algo";
import { makeInteractable, renderShiftX, renderShiftY, renderShiftZ, renderTiles } from "./city/render";
import { DEFAULT_CURVE, genVec3Curve, randomNumber, randomVector3 } from "./city/seed";
import { makeVector3 } from "./engine/vectors";
import ObjectCache from "./engine/cache";
import { transform } from "./api";
import { highlight } from "./engine/highlight";
import Engine from "./engine";
import { FLOOR_HEIGHT, INIT_CONTRIBUTIONS, INIT_RAW } from "./city/constants";
import { transitionVec3 } from "./utils/transition";
import { createPlaceholder } from "./engine/html-placeholder";
import { RawData } from "./api/total";
import { dispose, markNoDispose } from "./engine/dispose";
import { makeTransition } from "./engine/animations";
import { FilteredEvent } from "./store/poll";
import { ObjectEvent } from "@/engine/events";

export class DemoEngine extends Engine<DemoEngineEvent> {
  cache: ObjectCache<Mesh>;
  tooltip?: ReturnType<typeof createPlaceholder>;
  numbers?: ReturnType<typeof createPlaceholder>;
  week: number = 0;
  day: number = 0;
  data: number[][] = INIT_CONTRIBUTIONS;
  rawData: (RawData | undefined)[][] = INIT_RAW;
  bricks: number = 0;
  groups?: Group[][];
  focusingToday: boolean = true;

  constructor(window: Window, canvas: HTMLCanvasElement, container?: HTMLElement) {
    super(window, canvas, container);
    this.cache = new ObjectCache(() => this.createBox(), 'bricks');
  }

  dispose() {
    this.cache.clear();
    super.dispose();
  }

  setup() {
    super.setup();
    this.scene.background = new Color(0x9ad0ec);

    const base = new Vector3(0, -4, 0);

    this.add(GLTF_ENVIRONMENT, base, false, true);
    this.add(GLTF_ENVIRONMENT_OBJECTS, base, true, false);
    this.add(GLTF_ENVIRONMENT_ANIMATED, base, true, false);

    this.groups = renderTiles(this.scene, this.gltfLoader, getCity(INIT_CONTRIBUTIONS, INIT_CONTRIBUTIONS), this.interactables);
    this.start();

    this.tooltip = createPlaceholder(this.window.document);
    this.numbers = createPlaceholder(this.window.document);

    this.scene.addEventListener('focus', (e) => {
      if (e.isCurrentBuilding) {
        this.showTooltip(this.week, this.day);
        this.controls.autoRotate = true;
        this.focusingToday = true;
        this.setControlPosition(getPos(this.week, this.day));
      } else if (e.data) {
        const isToday = (this.week === e.data.week && this.day === e.data.day);
        this.showTooltip(e.data.week, e.data.day);
        this.controls.autoRotate = isToday;
        this.focusingToday = isToday;
        this.setControlPosition(getPos(e.data.week, e.data.day));
      }
    });

    this.scene.addEventListener('blur', () => {
      if (this.data !== INIT_CONTRIBUTIONS) {
        this.setControlPosition(getPos(this.week, this.day));
      }
      this.hideTooltip();
      this.controls.autoRotate = true;
    });
  }

  setControlPosition(newPosition: Vector3, duration = 1.5, curve = DEFAULT_CURVE) {
    const controlPositionTransition = transitionVec3(this.controls.target, newPosition, duration, curve);
    this.updatables.add(controlPositionTransition);
    controlPositionTransition.addEventListener('finished', () => {
      this.updatables.delete(controlPositionTransition);
    });
  }

  setTotal(raw: RawData[]) {
    const [data, rawData, [day, week]] = transform(raw);

    this.data = data;
    this.rawData = rawData;
    this.week = week;
    this.day = day;

    const tiles = getCity(data, rawData);

    this.groups?.forEach(groups => groups.forEach(group => {
      group.removeFromParent();
      dispose(group);
    }));
    const groups = this.groups = renderTiles(this.scene, this.gltfLoader, tiles, this.interactables);

    highlight(groups[day][week]);

    this.setNow(data, week, day);
  }

  add(asset: string, position: Vector3, castShadow = false, receiveShadow = false) {
    this.gltfLoader.load(asset, obj => {
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
    });
  }

  smoke?: Object3D;
  readonly smokeMaterial = markNoDispose(new MeshLambertMaterial({
    map: this.textureLoader.load('textures/smoke.png'),
    opacity: 0.01,
    transparent: true,
    emissive: new Color(0xffffff),
    fog: true,
  }));
  readonly smokeGeometry = markNoDispose(new PlaneGeometry());
  addSmoke?: () => void;

  createSmoke(pos: Vector3) {
    const geometry = this.smokeGeometry;
    const material = this.smokeMaterial;

    const smoke = new Group();

    const duration = 15;

    const create = () => {
      if (!this.running) {
        return;
      }

      const element = new Mesh(geometry, material.clone());
      element.scale.set(1, 1, 1);
      element.position.copy(randomVector3(makeVector3(0), makeVector3(0.5)));

      const from = element.position;
      const to = from.clone().add(new Vector3(0.2 * Math.random(), 3 * Math.random(), 0.2 * Math.random()));

      const s = Math.random() * 360;
      const qInitial = new Quaternion().setFromEuler(new Euler(0, 0, s, 'XYZ'));
      const qFinal = new Quaternion().setFromEuler(new Euler(0, 0, s + Math.random() * 360, 'XYZ'));

      makeTransition(this.mixers, element, 'smoke', duration, [
        new VectorKeyframeTrack('.position', [0, duration], [from, to].flatMap(vec => vec.toArray())),
        new NumberKeyframeTrack('.material.opacity', [0, duration * 0.4, duration * 0.6, duration], [0, 0.6, 0.6, 0], InterpolateLinear),
        new QuaternionKeyframeTrack('.quaternion', [0, duration], [qInitial, qFinal].flatMap(q => q.toArray())),
      ], NormalAnimationBlendMode);

      smoke.add(element);
    };

    smoke.scale.set(2, 2, 2);
    smoke.position.copy(pos);
    this.controls.addEventListener('change', () => {
      smoke.rotation.copy(this.camera.rotation);
    });
    this.scene.add(smoke);

    this.smoke = smoke;
    this.addSmoke = create;
  }

  setNow(data: number[][], week: number, day: number) {
    const pos = getPos(week, day, data[day][week] * FLOOR_HEIGHT * 2);

    // set camera
    this.setControlPosition(pos.clone().setY(0));

    // create smoke
    if (this.smoke) {
      this.smoke.removeFromParent();
      dispose(this.smoke);
    }
    this.createSmoke(pos);

    // create numbers
    // this.showNumbers(pos, week, day)

    // add base
    this.gltfLoader.load('models/building_base.glb', gltf => {
      gltf.scene.position.copy(pos);
      gltf.scene.position.setY(renderShiftZ);
      gltf.scene.scale.copy(makeVector3(0.6));
      gltf.scene.userData.isCurrentBuilding = true;
      makeInteractable(this.scene, gltf.scene, this.interactables);
      this.scene.add(gltf.scene);
    });
  }

  showNumbers(pos: Vector3, week: number, day: number) {
    const numbers = this.numbers!;
    numbers.object.position.copy(pos);
    numbers.object.position.y += 1.5;
    numbers.object.scale.set(5, 5, 5);
    if (!numbers.rendered) {
      this.scene.add(numbers.object);
      numbers.rendered = true;
    }
  }

  hideNumbers() {
    if (this.numbers?.rendered) {
      this.numbers.rendered = false;
      this.numbers.object.removeFromParent();
    }
  }

  showTooltip(week: number, day: number) {
    if (!this.rawData) {
      return;
    }
    const { events, event_day } = this.rawData[day][week] ?? { events: 0, event_day: 'unknown' };
    const pos = getPos(week, day, events / 100000 * FLOOR_HEIGHT * 2);
    const tooltip = this.tooltip!;

    this.dispatchEvent({
      type: 'update:tooltip',
      date: fmt.format(new Date(event_day)),
      value: events.toLocaleString('en'),
      isToday: week === this.week && day === this.day,
      floor: Math.floor(events / 100000),
    });
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

  readonly boxGeometry: BoxGeometry = markNoDispose(new BoxGeometry());

  private createBox(): Mesh {
    const material = new MeshStandardMaterial({ transparent: true });
    return new Mesh(this.boxGeometry, material);
  }

  private async _addBrick(from: Vector3, to: Vector3, scale: number, color: Color, duration: number, cb: () => void) {
    if (!this.running) {
      cb();
      return;
    }

    const mesh = this.cache.getOne();
    mesh.position.set(from.x, from.y, from.z);
    mesh.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360, 'XYZ');

    const material = <MeshStandardMaterial>mesh.material;
    material.color.set(color);

    const [positionTimes, positions] = genVec3Curve(DEFAULT_CURVE, from, randomVector3(to, makeVector3(1)));
    const [scaleTimes, scales] = genVec3Curve(DEFAULT_CURVE, makeVector3(scale), makeVector3(0));

    makeTransition(this.mixers, mesh, 'brick-entrance', duration, [
      new VectorKeyframeTrack('.position', positionTimes.map(i => i * duration), positions.flatMap(vec3 => vec3.toArray())),
      new VectorKeyframeTrack('.scale', scaleTimes.map(i => i * duration), scales.flatMap(vec3 => vec3.toArray())),
    ]);

    // remove when animation done
    (<Object3D<ObjectEvent>>mesh).addEventListener('removed', () => {
      this.cache.add(mesh);
      cb();
    });

    this.scene.add(mesh);
  }

  addBrick(_event: FilteredEvent) {
    // add bricks
    const fromPos = getPos(this.week, this.day).setY(40);
    const toPos = fromPos.clone().setY(this.data[this.day][this.week] * FLOOR_HEIGHT * 2);

    const from = randomVector3(fromPos, new Vector3(25, 10, 25));
    const duration = randomNumber(2, 0.5);
    const scale = randomNumber(3, 0.4);
    const color = randomVector3(makeVector3(0), makeVector3(1));
    this._addBrick(from, toPos, scale, new Color(color.x, color.y, color.z), duration, () => {
      this.bricks += 1;
      this.setCurrent((this.rawData[this.day][this.week]?.events ?? 0) + this.bricks);
      this.addSmoke?.();
    });
  }

  setCurrent(val: number) {
    this.dispatchEvent({
      type: 'update:current-number',
      value: val.toLocaleString('en'),
    });
  }
}

export function getPos(week: number, day: number, h?: number) {
  return new Vector3(2 * (week + renderShiftX) * 1.1, renderShiftZ * 2 + (h ?? 0), 2 * (day + renderShiftY) * 1.1);
}

const fmt = Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });

export interface UpdateTooltipEvent extends Event {
  type: 'update:tooltip';
  date: string;
  value: string;
  isToday: boolean;
  floor: number;
}

export interface UpdateCurrentNumberEvent extends Event {
  type: 'update:current-number';
  value: string;
}

type DemoEngineEvent =
  UpdateTooltipEvent
  | UpdateCurrentNumberEvent;