import { Object3D, PerspectiveCamera, Raycaster, Scene, WebGLRenderer, WebGLRenderTarget } from "three";
import { resizeRenderer } from "./renderer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { getSize, isInteractable } from "./utils";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { highlight, unhighlight } from "./highlight";

export function setupDOMListeners(window: Window, container: Window | HTMLElement, canvas: HTMLCanvasElement, scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer, target: WebGLRenderTarget, interactables: Set<Object3D>, composer: EffectComposer, outlinePass: OutlinePass) {
  const raycaster = new Raycaster();

  let canvasWidth = canvas.clientWidth;
  let canvasHeight = canvas.clientHeight;

  // add event listeners
  const handleWindowResize = () => {
    const size = getSize(container);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    canvasWidth = size.width;
    canvasHeight = size.height;
    resizeRenderer(window, container, renderer, target);
    composer.setSize(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio);
  };

  const handleClick = (event: MouseEvent) => {
    const x = event.clientX / canvasWidth * 2 - 1;
    const y = -event.clientY / canvasHeight * 2 + 1;
    raycaster.setFromCamera({ x, y }, camera);

    const [nearest] = raycaster.intersectObjects(Array.from(interactables), true);
    if (nearest) {
      let { object: target } = nearest;
      while (target.parent && !isInteractable(target)) {
        target = target.parent;
      }
      if (isInteractable(target)) {
        highlight(outlinePass, target);
        return;
      }
    }
    unhighlight(outlinePass);
  };

  window.addEventListener('resize', handleWindowResize);
  canvas.addEventListener('click', handleClick);

  // remove event listeners
  scene.addEventListener('removed', () => {
    window.removeEventListener('resize', handleWindowResize);
    canvas.removeEventListener('click', handleClick);
  });
}
