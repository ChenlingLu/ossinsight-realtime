const FPS = 60;
const FRAME_INTERVAL = 1 / FPS;

export function useAnimationFrame(cb: (ts: DOMHighResTimeStamp, diff: DOMHighResTimeStamp) => void) {
  let started = false;
  let h: undefined | number;
  let last: DOMHighResTimeStamp;
  let delta = 0;

  const _cb = (ts: DOMHighResTimeStamp) => {
    let diff = ts - last;
    delta += diff;
    last = ts;
    if (delta >= FRAME_INTERVAL) {
      cb(ts, diff);
    }
    if (started) {
      h = requestAnimationFrame(_cb);
    }
  };

  const start = () => {
    if (started) {
      return;
    }
    started = true;
    last = performance.now();
    h = requestAnimationFrame(_cb);
  };

  const stop = () => {
    started = false;
    if (h) {
      cancelAnimationFrame(h);
    }
  };

  return { start, stop };
}
