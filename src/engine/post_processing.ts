import { Camera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";

export function createPostProcessing(
  width: number,
  height: number,
  scene: Scene,
  camera: Camera,
  renderer: WebGLRenderer,
) {
  const composer = new EffectComposer(renderer, renderer.getRenderTarget() ?? undefined);

  const renderPass = new RenderPass(scene, camera)
  renderPass.renderToScreen = true;

  const outlinePass = new OutlinePass(new Vector2(width, height), scene, camera);
  outlinePass.edgeGlow = 2;
  outlinePass.edgeThickness = 2;
  outlinePass.downSampleRatio = 4;
  outlinePass.pulsePeriod = 3;


  composer.addPass(renderPass);
  composer.addPass(outlinePass);

  return { composer, outlinePass };
}