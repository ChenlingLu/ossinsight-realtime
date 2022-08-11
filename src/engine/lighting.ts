import { AmbientLight, DirectionalLight, Scene } from "three";

export function setupLighting(scene: Scene) {
  // Ambient lighting
  // const ambientLight = new AmbientLight(0x9ad0ec, 0.7);
  const ambientLight = new AmbientLight(0x9AD0EC, 1);
  scene.add(ambientLight);

  // Directional lighting and shadows
  const directionLight = new DirectionalLight(0xe9b37c);
  directionLight.position.set(-50, 50, -20);
  directionLight.castShadow = true;
  directionLight.shadow.mapSize.x = 768;
  directionLight.shadow.mapSize.y = 768;
  directionLight.shadow.camera.near = 15;
  directionLight.shadow.camera.far = 150.0;
  directionLight.shadow.camera.right = 75;
  directionLight.shadow.camera.left = -75;
  directionLight.shadow.camera.top = 75;
  directionLight.shadow.camera.bottom = -75;
  scene.add(directionLight);
}