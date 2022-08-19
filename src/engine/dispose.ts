import { Material, Object3D, RenderItem } from "three";
import { isMesh } from "./utils";

export function isRenderItem(obj: any): obj is RenderItem {
  return 'geometry' in obj && 'material' in obj
}

export function disposeMaterial(obj: Object3D) {
  if (!isRenderItem(obj)) return

  // because obj.material can be a material or array of materials
  const materials: Material[] = ([] as Material[]).concat(obj.material)

  for (const material of materials) {
    material.dispose()
  }
}

export function disposeObject(obj: Object3D, removeFromParent = true, destroyGeometry = true, destroyMaterial = true) {
  if (!obj) return

  if (isRenderItem(obj)) {
    if (obj.geometry && destroyGeometry) obj.geometry.dispose()
    if (destroyMaterial) disposeMaterial(obj)
  }

  removeFromParent &&
  Promise.resolve().then(() => {
    // if we remove children in the same tick then we can't continue traversing,
    // so we defer to the next microtask
    obj.parent && obj.parent.remove(obj)
  })
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
      disposeOptions.destroyMaterial
    )
  })
}

export function dispose(object3D: Object3D) {
  disposeObjectTree(object3D);
}
