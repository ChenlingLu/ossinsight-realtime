import './style.css';
import { setup } from "./engine";
import { demo } from "./demo";
import stats from "./engine/debug";

const { scene, start, animationMixers, interactables, outlinePass } = setup(window, <HTMLCanvasElement>document.getElementById('app'));

await demo(scene, outlinePass, animationMixers, interactables);

start()

if (stats !== undefined) {
  document.body.append(stats.dom)
}
