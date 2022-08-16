import { Stream } from "./stream";

const TICK = Symbol('tick');

export class ClockStream extends Stream<typeof TICK> {
  private started = false
  private handle: ReturnType<typeof setInterval> | undefined = undefined;

  constructor(interval: number) {
    super({
      request: () => {
        if (this.started) {
          return
        }
        this.started = true;
        this.handle = setInterval(() => {
          this.provide([TICK]);
        }, interval);
      },
      stop: () => {
        clearInterval(this.handle);
        this.started = true;
        this.stop();
      },
    });
  }

}