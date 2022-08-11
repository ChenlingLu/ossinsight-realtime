import { Clock } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { Updatable } from "./updatables";
import stats from "./debug";

const FPS = 60;
const FRAME_INTERVAL = 1 / FPS;

export function createAnimate(composer: EffectComposer, ...updatableList: Updatable[]) {
  const clock = new Clock();
  let animateHandle: number = 0;
  let stopped = true;
  let delta = 0;

  function animate() {
    if (stopped) {
      return;
    }
    delta += clock.getDelta();

    if (delta >= FRAME_INTERVAL) {
      stats?.begin();

      updatableList.forEach(updatable => {
        if (updatable.update.length === 0) {
          updatable.update();
        } else {
          updatable.update(delta);
        }
      });

      composer.render();

      delta %= FRAME_INTERVAL;
      stats?.end();
    }
    animateHandle = requestAnimationFrame(animate);
  }

  function start() {
    if (stopped) {
      stopped = false;
      animate();
    }
  }

  function stop() {
    stopped = true;
    cancelAnimationFrame(animateHandle);
  }

  return { start, stop };
}