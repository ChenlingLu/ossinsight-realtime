import { Loader } from "three";

interface AsyncLoadable<T> {
  loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<T>;
}

export default class ObjectCache<T> extends Set<T> {
  n = 0
  private readonly loaded: Promise<any>
  constructor(private loader: Loader & AsyncLoadable<T>, private url: string) {
    super();
    this.loaded = this.loader.loadAsync(this.url)
  }

  async getOne(): Promise<T> {
    const result = this[Symbol.iterator]().next()
    if (!result.done) {
      this.delete(result.value)
      return result.value as T
    }
    this.n += 1
    await this.loaded
    return await this.loader.loadAsync(this.url);
  }
}