export default class ObjectCache<T> extends Set<T> {
  allLoaded: Set<T> = new Set();

  constructor(private create: () => T) {
    super();
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
    this.allLoaded.clear();
  }
}