import './style.css';
import { DemoEngine } from "./demo";
import stats from "./engine/debug";

const engine = new DemoEngine(window, <HTMLCanvasElement>document.getElementById('app'));

engine.setup();
engine.init();

if (stats !== undefined) {
  document.body.append(stats.dom);
}
