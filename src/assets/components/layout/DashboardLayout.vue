<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, formActionDefault } from '@/utils/supabase'

const drawer = ref(true)
const formAction = ref({ ...formActionDefault })
const router = useRouter()

const onLogout = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { error } = await supabase.auth.signOut()
  formAction.value.formProcess = false

  if (error) {
    console.error('Error during logout:', error)
    return
  }

  router.replace('/')
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    route: '/maindashboard',
  },
  {
    title: 'Products',
    icon: 'mdi-cube-outline',
    children: [{ title: 'All Products', route: '/dashboard' }],
  },
  {
    title: 'Orders',
    icon: 'mdi-cart-outline',
    children: [
      { title: 'My Orders', route: '/orderView' },
      { title: 'Order History', route: '/orderhistory' },
    ],
  },
  {
    title: 'Account',
    icon: 'mdi-account-outline',
    children: [{ title: 'Account Information', route: '/accountview' }],
  },
  {
    title: 'Logout',
    icon: 'mdi-logout',
    action: onLogout, // Use an action instead of route
  },
]
</script>

<template>
  <v-app class="bg-green-lighten-5" style="min-height: 100vh">
    <!-- App Bar -->
    <v-app-bar app color="success" dark elevation="3" class="px-4 d-flex align-center justify-space-between">
      <div class="d-flex align-center gap-3">
        <v-app-bar-nav-icon variant="text" @click="drawer = !drawer" />
        <v-toolbar-title class="font-weight-bold mx-2">MarketPlace</v-toolbar-title>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer app v-model="drawer" class="elevation-8" width="310">
      <v-list dense>
        <template v-for="item in menuItems" :key="item.title">
          <!-- List Group -->
          <v-list-group v-if="item.children" color="success">
            <template #activator="{ props }">
              <v-list-item v-bind="props" class="px-6 py-4">
                <div class="d-flex align-center">
                  <v-icon size="36" color="success" class="me-2">{{ item.icon }}</v-icon>
                  <v-list-item-title class="font-weight-medium mb-0">{{ item.title }}</v-list-item-title>
                </div>
              </v-list-item>
            </template>
            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              :to="child.route"
              link
              class="pl-10"
              active-class="bg-green-dark text-black"
            >
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <!-- Single List Item -->
          <v-list-item
            v-else
            :to="item.route || undefined"
            link
            class="my-1 px-6 py-3 transition-all duration-200 ease-in-out hover:bg-green-darken-3"
            active-class="bg-green-dark text-black"
            @click="item.action && item.action()"
          >
            <div class="d-flex align-center gap-3">
              <v-icon size="36" color="success">{{ item.icon }}</v-icon>
              <span class="px-2 font-weight-medium">{{ item.title }}</span>
            </div>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="d-flex flex-column" style="flex-grow: 1">
      <v-container fluid class="flex-grow-1">
        <slot />
        <!-- OR: <router-view /> -->
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="success" class="text-center white--text py-3 d-flex justify-center">
      <span>&copy; {{ new Date().getFullYear() }} MarketPlace. All rights reserved.</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.ml-auto {
  margin-left: auto;
}
</style>
