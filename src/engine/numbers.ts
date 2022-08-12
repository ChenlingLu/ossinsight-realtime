import { CanvasTexture, Mesh, MeshLambertMaterial, PlaneGeometry } from "three";
import { GreaterDepth } from "three/src/constants";


export function createNumberCanvasTexture(document: Document, width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  let current: number = 0;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (ctx) {
    ctx.font = `bold ${height / 4}px sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
  }

  let from: number;
  let to: number;
  let step: number;
  let animating = false;

  const setValue = (value: number) => {
    if (ctx) {
      from = current;
      to = value;
      animating = true;
    }
  };

  const update = (delta: number) => {
    if (!animating) {
      return;
    }
    if (ctx) {
      step = Math.floor((to - from) * delta) || (to > from ? 1 : -1); // prevent 0
      if (Math.abs(to - current) <= Math.abs(step)) {
        current = to;
        animating = false;
      } else {
        current += step;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillText(current.toLocaleString('en'), width / 2, height / 2);
      ctx.strokeText(current.toLocaleString('en'), width / 2, height / 2);
      texture.needsUpdate = true;
    }
  };

  const texture = new CanvasTexture(canvas);

  return { texture, update, setValue };
}

export function createNumbers(window: Window, width: number, height: number) {
  const {
    texture,
    update,
    setValue,
  } = createNumberCanvasTexture(window.document, width * window.devicePixelRatio, height * window.devicePixelRatio);

  const geometry = new PlaneGeometry(1, 1);
  const material = new MeshLambertMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    depthFunc: GreaterDepth,
    // emissive: new Color(0xffffff),
  });


  const mesh = new Mesh(geometry, material);

  return {
    mesh, update, setValue,
  };
}
