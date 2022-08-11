import { Object3D } from "three";

export function setShadow(obj: Object3D, cast = false, receive = false) {
  obj.castShadow = cast;
  obj.receiveShadow = receive;
  if (obj?.children != null) {
    for (const child of obj.children) {
      setShadow(child, cast, receive);
    }
  }
}