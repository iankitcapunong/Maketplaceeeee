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

  // Update orders data
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
      <v-container fluid class="pa-6">
        <h2 class="text-h4 font-weight-bold mb-6">📊 Dashboard</h2>

        <!-- Stats Cards -->
        <v-row dense>
          <v-col cols="12" sm="6" md="3">
            <v-card class="elevation-2 rounded-xl">
              <v-card-text class="text-center">
                <h4 class="text-h6 font-weight-bold">Total Orders</h4>
                <p class="text-h5 font-weight-bold">{{ totalOrders }}</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="elevation-2 rounded-xl">
              <v-card-text class="text-center">
                <h4 class="text-h6 font-weight-bold">Pending</h4>
                <p class="text-h5 font-weight-bold text-warning">{{ pendingOrders }}</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="elevation-2 rounded-xl">
              <v-card-text class="text-center">
                <h4 class="text-h6 font-weight-bold">Delivered</h4>
                <p class="text-h5 font-weight-bold text-success">{{ deliveredOrders }}</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="elevation-2 rounded-xl">
              <v-card-text class="text-center">
                <h4 class="text-h6 font-weight-bold">Canceled</h4>
                <p class="text-h5 font-weight-bold text-error">{{ canceledOrders }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Orders Section -->
        <div class="d-flex justify-space-between align-center mt-5 mb-6">
          <h3 class="text-h5 font-weight-bold">📦 Recent Orders</h3>
          <v-btn color="primary" @click="$router.push('/OrderView')" class="text-transform-none">
            View All Orders
          </v-btn>
        </div>

        <!-- Recent Orders Table -->
        <v-card class="elevation-2 rounded-xl mt-6">
          <v-card-title class="text-h6 font-weight-bold">🧾 Recent Orders</v-card-title>
          <v-data-table
            :headers="[
              { text: 'Product Name', value: 'name' },
              { text: 'Quantity', value: 'quantity' },
              { text: 'Total Price', value: 'total_price' },
              { text: 'Status', value: 'status' },
            ]"
            :items="recentOrders"
            hide-default-footer
            item-value="order_item_id"
            item-key="order_item_id"
            :items-per-page="5"
            :loading="!recentOrders.length"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                size="small"
                :color="
                  {
                    Pending: 'orange',
                    Delivered: 'green',
                    Canceled: 'red',
                  }[item.status] || 'grey'
                "
                text-color="white"
                class="font-weight-medium"
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </template>
  </DashboardLayout>
</template>
