import { PerspectiveCamera } from "three";

export function createCamera(window: Window) {
  const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    400,
  );
  camera.position.set(0, 30, 51);

  return camera;
}