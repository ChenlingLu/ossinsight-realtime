import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LoadingManager } from "three";
import { dispose } from "@/engine/dispose";

export class CachedGLTFLoader extends GLTFLoader {
  private cache = new Map<string, Promise<GLTF>>();

  constructor(private clone: (source: GLTF) => GLTF, manager?: LoadingManager) {
    super(manager);

    if (import.meta.hot) {
      import.meta.hot.on('vite:beforeUpdate', (data) => {
        for (let gltf of this.cache.values()) {
          gltf.then(gltf => dispose(gltf.scene));
        }
        this.cache.clear();
      });
    }
  }

  load(url: string, onLoad: (gltf: GLTF) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void) {
    let gltfPromise = this.cache.get(url);
    if (!gltfPromise) {
      gltfPromise = new Promise((resolve, reject) => {
        super.load(url, resolve, onProgress, reject);
      });
      this.cache.set(url, gltfPromise);
    }
    gltfPromise.then(gltf => {
      onLoad(this.clone(gltf));
    }).catch(onError);
  }

}