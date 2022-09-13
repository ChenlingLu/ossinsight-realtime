import { createRouter, createWebHistory } from "vue-router";
import { CSSProperties } from "vue";
import { Breakpoint } from "@/store";

declare module 'vue-router' {
  interface RouteMeta {
    main?: {
      style?: CSSProperties
      breakpoint?: Breakpoint | number
    };
    side?: {
      style?: CSSProperties
    };
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: () => import('@/views/home/main'),
        side: () => import('@/views/home/side'),
      },
      meta: {
        main: {
          breakpoint: 'sm',
        },
      },
    },
    {
      path: import.meta.env.PROD ? '/__preview__/detail' : '/detail',
      name: '2D',
      components: {
        default: () => import('@/views/detail/main'),
        side: () => import('@/views/detail/side'),
      },
      meta: {
        main: {
          style: {
            backgroundColor: 'var(--b7)',
          },
          breakpoint: 'sm',
        },
      },
    },
  ],
});

export default router;
