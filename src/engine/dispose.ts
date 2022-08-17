import { Object3D } from "three";
import { isMesh } from "./utils";

let n = 0
export function dispose(object3D: Object3D) {
  function disposeSingle(object: Object3D) {
    if (isMesh(object)) {
      n += 1;
      object.geometry.dispose();
      if (object.material instanceof Array) {
        object.material.forEach(m => m.dispose());
      } else {
        object.material.dispose();
      }
    }
  }
  object3D.traverse(disposeSingle);
}
