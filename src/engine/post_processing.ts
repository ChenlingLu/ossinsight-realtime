import { Camera, Scene, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

export function createPostProcessing(
  scene: Scene,
  camera: Camera,
  renderer: WebGLRenderer,
) {
  const composer = new EffectComposer(renderer, renderer.getRenderTarget() ?? undefined);

  const renderPass = new RenderPass(scene, camera);
  renderPass.needsSwap = true;

  composer.addPass(renderPass);

  return { composer };
}