<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/assets/components/layout/DashboardLayout.vue'

// Data refs
const totalOrders = ref(0)
const pendingOrders = ref(0)
const deliveredOrders = ref(0)
const canceledOrders = ref(0)
const recentOrders = ref([])

// Fetch orders
const fetchOrders = async () => {
  const { data, error } = await supabase.from('Orders').select('*')
  if (error) {
    console.error('Error fetching Orders:', error)
    return
  }

  orders.value = data

  // Count
  totalOrders.value = data.length
  pendingOrders.value = data.filter((o) => o.status === 'Pending').length
  deliveredOrders.value = data.filter((o) => o.status === 'Delivered').length
  canceledOrders.value = data.filter((o) => o.status === 'Canceled').length

  // Recent orders (limit to 5)
  recentOrders.value = data.slice(0, 5).map((o) => ({
    order_item_id: o.order_item_id,
    name: o.name,
    quantity: o.quantity,
    total_price: `₱${o.total_price}`,
    status: o.status,
  }))
}

onMounted(fetchOrders)
</script>

<template>
  <DashboardLayout>
    <template #default>
      <v-container fluid>
        <h2 class="text-h5 font-weight-bold mb-4">📊 Dashboard</h2>

        <!-- Stats Cards -->
        <v-row dense>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>Total Orders</h3>
              <p class="text-h6 font-weight-bold">{{ totalOrders }}</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>Pending</h3>
              <p class="text-h6 font-weight-bold text-warning">{{ pendingOrders }}</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>Delivered</h3>
              <p class="text-h6 font-weight-bold text-success">{{ deliveredOrders }}</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>Canceled</h3>
              <p class="text-h6 font-weight-bold text-error">{{ canceledOrders }}</p>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 font-weight-bold">📦 Recent Orders</h3>
          <v-btn color="primary" @click="$router.push('/OrderView')">My Orders</v-btn>
        </div>

        <!-- Recent Orders Table -->
        <v-card class="mt-6">
          <v-card-title>🧾 Recent Orders</v-card-title>
          <v-data-table
            :headers="[
              { text: 'Name', value: 'name' },
              { text: 'Quantity', value: 'quantity' },
              { text: 'Total Price', value: 'total_price' },
              { text: 'Status', value: 'status' },
            ]"
            :items="recentOrders"
            class="elevation-1"
            hide-default-footer
          />
        </v-card>
      </v-container>
    </template>
  </DashboardLayout>
</template>
