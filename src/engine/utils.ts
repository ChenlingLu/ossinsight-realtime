import type { Mesh, Object3D, Scene } from "three";
import { Vector2 } from "three";

export function isMesh(t: Object3D): t is Mesh {
  return t.type === 'Mesh';
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