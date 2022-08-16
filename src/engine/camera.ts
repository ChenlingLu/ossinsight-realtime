import { PerspectiveCamera } from "three";
import { getSize } from "./utils";

export function createCamera(container: HTMLElement | Window) {
  const { width, height} = getSize(container)
  const camera = new PerspectiveCamera(
    50,
    width / height,
    0.1,
    400,
  );
  camera.position.set(0, 30, 51);

  return camera;
}