import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import DashboardView from '@/views/Product/DashboardView.vue'
import OrderView from '@/views/Order/OrderView.vue'
import OrderHistory from '../views/Order/OrderHistory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/orderView',
      name: 'orderView',
      component: OrderView,
    },
    {
      path: '/orderhistory',
      name: 'orderhistory',
      component: OrderHistory,
    },
  ],
})

export default router
