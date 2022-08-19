import { EventDispatcher, Vector2, Vector3 } from "three";
import { Updatable } from "@/engine/updatables";

abstract class Transition extends EventDispatcher implements Updatable {
  finished = false;
  abstract update(delta: number): void
}

class Vector3Transition extends Transition {
  private i = 0;
  private currentTime = 0;
  private from: Vector3;

  constructor(private target: Vector3, private to: Vector3, private duration: number, private curve: Vector2[]) {
    super();
    this.from = target.clone();
  }

  update(delta: number) {
    if (this.finished) {
      return
    }
    this.currentTime += delta;
    const percent = Math.min(1, this.currentTime / this.duration);
    let v0: Vector2, v1: Vector2;
    while (this.i < this.curve.length - 1 && this.curve[this.i + 1].x < percent) {
      this.i += 1;
    }
    v0 = this.curve[this.i].clone();
    if (this.i === this.curve.length - 2 && percent >= this.curve[this.i - 1].y) {
      v1 = v0;
      this.finished = true
      this.dispatchEvent({
        type: 'finished',
      });
    } else {
      v1 = this.curve[this.i + 1].clone();
    }


    const f = v1 === v0 ? 0 : (percent - v0.x) / (v1.x - v0.x);
    const y = v0.y * (1 - f) + v1.y * f;

    const newVector = this.from.clone().multiplyScalar(1 - y).add(this.to.clone().multiplyScalar(y));
    this.target.copy(newVector);
  }
}

export function transitionVec3(target: Vector3, to: Vector3, duration: number, curve: Vector2[]): Transition {
  return new Vector3Transition(target, to, duration, curve);
}