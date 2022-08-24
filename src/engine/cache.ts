import { createDebugLogger } from "@/utils/debug";
import { dispose } from "@/engine/dispose";
import { isObject3D } from "@/engine/utils";

const DEBUG_LOG_INTERVAL = 5000;

export default class ObjectCache<T> extends Set<T> {
  allLoaded: Set<T> = new Set();
  private readonly h: ReturnType<typeof setInterval> | undefined;

  constructor(private create: () => T, debugName: string = 'unnamed') {
    super();

    if (import.meta.env.DEV) {
      const log = createDebugLogger(`cache:${debugName}`);
      this.h = setInterval(() => {
        log('loaded =', this.allLoaded.size);
      }, DEBUG_LOG_INTERVAL);
    }
  }

  getOne(): T {
    const result = this[Symbol.iterator]().next();
    if (!result.done) {
      this.delete(result.value);
      return result.value as T;
    }
    const obj = this.create();
    this.allLoaded.add(obj);
    return obj;
  }

  clear() {
    super.clear();
    this.allLoaded.forEach(item => {
      if (isObject3D(item)) {
        dispose(item);
      }
    });
    this.allLoaded.clear();
    clearInterval(this.h);
  }
}