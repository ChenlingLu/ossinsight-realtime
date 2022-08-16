import { Stream } from "./stream";

export class ArrayStream<T> extends Stream<T> {
  private finished: boolean = false;

  constructor(array: T[]) {
    super({
      request: () => {
        if (this.finished) {
          return;
        }
        this.provide(array);
        this.finished = true;
        this.stop();
      },
      stop: () => {
        this.finished = true;
        this.stop();
      },
    });
  }
}


