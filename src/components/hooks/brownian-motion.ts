import { ref } from "vue";
import { useAnimationFrame } from "@/components/hooks/animation-frame";

type Vec2 = {
  readonly x: number
  readonly y: number
}

function vec2(x: number, y: number): Vec2 {
  return Object.freeze({ x, y });
}

function vec2Add(dst: Vec2, src: Vec2, factor: number): Vec2 {
  return vec2(dst.x + src.x * factor, dst.y + src.y * factor);
}

function vec2Restrict(v: Vec2, factor: number) {
  let v2 = v.x * v.x + v.y * v.y;
  if (v2 > factor * factor) {
    const d = Math.sqrt(v2);
    return vec2(v.x / d * factor, v.y / d * factor);
  }
  return v;
}

function vec2Mod(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function useBrownianMotion(randomForce = 5, gravityFactor = 2, maxVelocity = 3, maxOffset = 5) {
  const initial = Math.random() * Math.PI * 2;

  const a = ref(vec2(randomForce * Math.cos(initial), randomForce * Math.sin(initial)));
  const v = ref(vec2(0, 0));
  const offset = ref(vec2(0, 0));

  const { start, stop } = useAnimationFrame((_, diff) => {
    const t = diff / 1000;

    const distance = vec2Mod(offset.value);

    const gravity = vec2(-offset.value.x * distance * gravityFactor, -offset.value.y * distance * gravityFactor);

    // compute new offset
    offset.value = vec2Add(offset.value, v.value, t);
    offset.value = vec2Restrict(offset.value, maxOffset);

    // compute new velocity
    v.value = vec2Restrict(vec2Add(v.value, a.value, t), maxVelocity);

    // compute new accelerate
    a.value = vec2Add(a.value, vec2(Math.random(), Math.random()), randomForce * t);
    a.value = vec2Add(a.value, gravity, t);
  });

  return { offset, start, stop };
}

export {};
