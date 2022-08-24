import { Material, Object3D, RenderItem } from "three";
import { isBufferGeometry, isMaterial, isObject3D } from "@/engine/utils";

export function isRenderItem(obj: any): obj is RenderItem {
  return 'geometry' in obj && 'material' in obj;
}

interface DisposableTarget {
  dispose: () => void;
  userData: any;
}

function _dispose(disposable: DisposableTarget) {
  if (!disposable.userData[NO_DISPOSE]) {
    disposable.dispose();
  }
}

export function disposeMaterial(obj: Object3D) {
  if (!isRenderItem(obj)) return;

  // because obj.material can be a material or array of materials
  const materials: Material[] = ([] as Material[]).concat(obj.material);

  for (const material of materials) {
    _dispose(material);
  }
}

export function disposeObject(obj: Object3D, removeFromParent = true, destroyGeometry = true, destroyMaterial = true) {
  if (!obj) return;

  if (isRenderItem(obj)) {
    if (obj.geometry && destroyGeometry) _dispose(obj.geometry);
    if (destroyMaterial) disposeMaterial(obj);
  }

  removeFromParent &&
  Promise.resolve().then(() => {
    // if we remove children in the same tick then we can't continue traversing,
    // so we defer to the next microtask
    obj.parent && obj.parent.remove(obj);
  });
}

type DisposeOptions = Partial<{
  removeFromParent: boolean
  destroyGeometry: boolean
  destroyMaterial: boolean
}>

export function disposeObjectTree(obj: Object3D, disposeOptions: DisposeOptions = {}) {
  obj.traverse(node => {
    disposeObject(
      node,
      disposeOptions.removeFromParent,
      disposeOptions.destroyGeometry,
      disposeOptions.destroyMaterial,
    );
  });
}

export function dispose(object3D: Object3D<any>) {
  disposeObjectTree(object3D);
}

const NO_DISPOSE = Symbol('no-dispose');

export function markNoDispose<T extends DisposableTarget>(target: T): T {
  target.userData[NO_DISPOSE] = true;


  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
      delete target.userData[NO_DISPOSE];
      if (isObject3D(target)) {
        dispose(target);
      } else if (isBufferGeometry(target)) {
        _dispose(target);
      } else if (isMaterial(target)) {
        _dispose(target);
      }
    });
  }
  return target;
}
