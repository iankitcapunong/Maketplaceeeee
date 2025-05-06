import { createRouter, createWebHistory } from 'vue-router'
import LogInView from '@/views/auth/LogInView.vue'

import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/Product/dashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LogInView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
   
  ],
})

export default router
