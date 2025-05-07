import { createRouter, createWebHistory } from 'vue-router'
import LogInView from '@/views/auth/LogInView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import OrderView from '@/views/Order/OrderView.vue'
import OrderHistory from '@/views/Order/OrderHistory.vue'
import ProductView from '@/views/Product/ProductView.vue'
import AccountView from '@/views/Account/AccountView.vue'
import MainDashboard from '@/views/MainDashboard.vue'

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
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'product',
      component: ProductView,
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
    {
      path: '/accountview',
      name: 'accountview',
      component: AccountView,
    },
    {
      path: '/maindashboard',
      name: 'maindashboard',
      component: MainDashboard,
    },
  ],
})

export default router
