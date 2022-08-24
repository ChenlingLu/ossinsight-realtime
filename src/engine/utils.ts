import type { BaseEvent, EventListener, Mesh, Object3D, Scene } from "three";
import { BufferGeometry, EventDispatcher, Material, Vector2 } from "three";

export function isMesh(t: Object3D): t is Mesh {
  return t.type === 'Mesh';
}

export function isObject3D(t: any): t is Object3D {
  return !!(t as Object3D)?.isObject3D;
}

export function isMaterial(t: any): t is Material {
  return !!(t as Material)?.isMaterial;
}

export function isBufferGeometry(t: any): t is BufferGeometry {
  return !!(t as BufferGeometry)?.isBufferGeometry;
}

export function isScene(t: Object3D): t is Scene {
  return t.type === 'Scene';
}

export function isInteractable(t: Object3D): boolean {
  return !!t.userData.interactable;
}

export function isElement(el: Window | HTMLElement): el is HTMLElement {
  return (el as HTMLElement).nodeType === 1;
}

export function getSize(el: Window | HTMLElement): Vector2 {
  if (isElement(el)) {
    return new Vector2(el.clientWidth, el.clientHeight);
  } else {
    return new Vector2(el.innerWidth, el.innerHeight);
  }
}

export function once<E extends BaseEvent, D extends EventDispatcher<E>>(dispatcher: D, event: E['type'], handler: EventListener<E, E['type'], D>) {
  const _handler = (e: E & { type: E['type'] } & { target: D }) => {
    handler(e);
    dispatcher.removeEventListener(event, _handler);
  };
  dispatcher.addEventListener(event, _handler);
}