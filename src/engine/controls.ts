import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Camera, WebGLRenderer } from "three";

export function createControls(camera: Camera, renderer: WebGLRenderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = -1;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enablePan = false;
  controls.minDistance = 30;
  controls.maxDistance = 150;

  return controls;
}