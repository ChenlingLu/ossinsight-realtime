import { Object3D, Scene } from "three";

export function highlight(object: Object3D) {
  object.dispatchEvent({
    type: 'focus',
    isCurrentBuilding: object.userData.isCurrentBuilding,
  });
}

export function unhighlight(scene: Scene) {
  scene.dispatchEvent({
    type: 'blur',
  });
}
