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
      path: '/__preview__/detail',
      name: '2D',
      components: {
        // default: () => import('@/views/home/main'),
        side: () => import('@/views/detail/side'),
      },
    },
  ],
});

export default router;
