import './style.css';
import { setup } from "./engine";
import { demo } from "./demo";
import stats from "./engine/debug";

const { scene, start, animationMixers, interactables, outlinePass } = setup(window, <HTMLCanvasElement>document.getElementById('app'));

demo(scene, outlinePass, animationMixers, interactables)
.then(() => {
  start()
})

if (stats !== undefined) {
  document.body.append(stats.dom)
}
