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

export function getSize(el: Window | HTMLElement): Vector2 {
  return new Vector2(
    (el as HTMLElement).clientWidth || (el as Window).innerWidth,
    (el as HTMLElement).clientHeight || (el as Window).innerHeight,
  );
}