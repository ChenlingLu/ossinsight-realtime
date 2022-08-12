import { Object3D } from "three";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

export function highlight(outlinePass: OutlinePass, object: Object3D) {
  outlinePass.selectedObjects = [object];
  object.dispatchEvent({
    type: 'focus',
  });
}

export function unhighlight(outlinePass: OutlinePass, object?: Object3D) {
  if (object) {
    if (outlinePass.selectedObjects[0] === object) {
      outlinePass.selectedObjects = [];
      object.dispatchEvent({
        type: 'blur',
      });
      return true;
    }
  } else if (outlinePass.selectedObjects.length > 0) {
    outlinePass.selectedObjects[0].dispatchEvent({
      type: 'blur',
    });
    outlinePass.selectedObjects = [];
    return true;
  }
  return false;
}
