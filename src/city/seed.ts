import { CubicBezierCurve, Vector2, Vector3 } from "three";


function cubicBezier(p0: number, p1: number, p2: number, p3: number, count: number = 20): Vector2[] {
  const curve = new CubicBezierCurve(
    new Vector2(0, 0),
    new Vector2(p0, p1),
    new Vector2(p2, p3),
    new Vector2(1, 1),
  );

  return curve.getPoints(count);
}

export const DEFAULT_CURVE = cubicBezier(.42, .0, .58, .1);


export function genVec3Curve(curve: Vector2[], start: Vector3, end: Vector3): [number[], Vector3[]] {
  const delta = end.clone().sub(start);
  return [
    curve.map(scalar => scalar.x),
    curve.map(scalar => start.clone().add(delta.clone().multiplyScalar(scalar.y))),
  ];
}

export function genNumberCurve(curve: Vector2[], start: number, end: number): [number[], number[]] {
  const delta = end - start;
  return [
    curve.map(scalar => scalar.x),
    curve.map(scalar => start + delta * scalar.y),
  ];
}

function rand() {
  return Math.random() * 2 - 1;
}

export function randomVector3(vec3: Vector3, v: Vector3): Vector3 {
  return vec3.clone().add(v.clone().multiply(new Vector3(rand(), rand(), rand())));
}

export function randomNumber(numb: number, v: number): number {
  return numb + v * rand();
}

