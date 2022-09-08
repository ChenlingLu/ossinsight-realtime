import { createRouter, createWebHistory } from "vue-router";

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
    },
    {
      path: import.meta.env.PROD ? '/__preview__/detail' : '/detail',
      name: '2D',
      components: {
        default: () => import('@/views/detail/main'),
        side: () => import('@/views/detail/side'),
      },
    },
  ],
});

export default router;
