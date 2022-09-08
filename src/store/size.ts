import { acceptHMRUpdate, defineStore } from "pinia";

const getWindow = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window;
};

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;

export const enum DeviceDirection {
  portrait = 'portrait',
  landscape = 'landscape',
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg'

const BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 520,
  md: 750,
  lg: 1200,
};

const BREAKPOINTS_DOWN: Record<Breakpoint, number> = {
  xs: BREAKPOINTS.sm - 1,
  sm: BREAKPOINTS.md - 1,
  md: BREAKPOINTS.lg - 1,
  lg: Infinity,
};

export const useSize = defineStore('size', {
  state: () => ({
    width: getWindow()?.innerWidth ?? DEFAULT_WIDTH,
    height: getWindow()?.innerHeight ?? DEFAULT_HEIGHT,
  }),
  actions: {
    resize(width?: number, height?: number) {
      this.width = width ?? getWindow()?.innerWidth ?? DEFAULT_WIDTH;
      this.height = height ?? getWindow()?.innerHeight ?? DEFAULT_HEIGHT;
    },
  },
  getters: {
    direction: (state): DeviceDirection => {
      return state.height > state.width ? DeviceDirection.portrait : DeviceDirection.landscape;
    },
    down: (state): (breakpoint: Breakpoint) => boolean => {
      const { width } = state;
      return breakpoint => {
        return width <= BREAKPOINTS_DOWN[breakpoint];
      };
    },
    up: (state): (breakpoint: Breakpoint) => boolean => {
      const { width } = state;
      return breakpoint => {
        return width >= BREAKPOINTS[breakpoint];
      };
    },
  },
});

export function installResize() {
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSize, import.meta.hot));
  }

  const size = useSize();

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => size.resize());
  }
}
