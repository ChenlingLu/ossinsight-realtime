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
  ],
});

export default router;
