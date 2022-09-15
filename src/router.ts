import { createRouter, createWebHistory } from "vue-router";
import { CSSProperties } from "vue";
import { Breakpoint } from "@/store";

declare module 'vue-router' {
  interface RouteMeta {
    title: {
      text: string
      style?: CSSProperties
    };
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
      path: '/3d',
      name: '3D',
      components: {
        default: () => import('@/views/home/main'),
        side: () => import('@/views/home/side'),
      },
      meta: {
        title: {
          text: 'Real-time GitHub Contribution City 2022',
          style: {
            color: 'white'
          }
        },
        main: {
          breakpoint: 'sm',
        },
      },
    },
    {
      path: '/',
      name: '2D',
      components: {
        default: () => import('@/views/2d/main'),
        side: () => import('@/views/2d/side'),
      },
      meta: {
        title: {
          text: 'Real-time GitHub Contribution Insight',
        },
        main: {
          style: {
            backgroundColor: 'var(--b7)',
          },
          breakpoint: 'sm',
        },
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/',
    }
  ],
});

export default router;
