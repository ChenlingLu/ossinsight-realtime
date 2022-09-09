export function arc(degree: number) {
  return degree / 180 * Math.PI;
}

export function random(from: number, to: number) {
  return from + (to - from) * Math.random();
}
