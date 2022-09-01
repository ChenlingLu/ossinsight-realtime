import { Camera, Clock, Scene } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { Updatable } from "./updatables";
import stats from "./debug";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { createDebugLogger } from "@/utils/debug";

const FPS = 60;
const FRAME_INTERVAL = 1 / FPS;

export function createAnimate(scene: Scene, camera: Camera, composer: EffectComposer, renderer2d: CSS2DRenderer, ...updatableList: Updatable[]) {
  const log = createDebugLogger('animate')
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
      renderer2d.render(scene, camera);

      delta %= FRAME_INTERVAL;
      stats?.end();
    }
    animateHandle = requestAnimationFrame(animate);
  }

  function start() {
    if (stopped) {
      log('start');
      stopped = false;
      animate();
    }
  }

  function stop() {
    log('stop');
    stopped = true;
    cancelAnimationFrame(animateHandle);
  }

  return { start, stop };
}