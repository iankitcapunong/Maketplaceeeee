<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '@/assets/components/layout/DashboardLayout.vue'

const totalOrders = ref(0)
const pendingOrders = ref(0)
const deliveredOrders = ref(0)
const canceledOrders = ref(0)
const recentOrders = ref([])

const fetchOrders = async () => {
  const { data, error } = await supabase.from('Orders').select('*')
  if (error) {
    console.error('Error fetching Orders:', error)
    return
  }

  totalOrders.value = data.length
  pendingOrders.value = data.filter(o => o.status === 'Pending').length
  deliveredOrders.value = data.filter(o => o.status === 'Delivered').length
  canceledOrders.value = data.filter(o => o.status === 'Canceled').length

  recentOrders.value = data.slice(0, 5).map(o => ({
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
        <h2 class="text-h4 font-weight-bold mb-6 text-success">
              🌿 Welcome to Your Order Dashboard
            </h2>
                <v-row dense>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>🛒 Total Orders</h3>
              <p class="text-h6 font-weight-bold">{{ totalOrders }} </p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>⏳ Pending</h3>
              <p class="text-h6 font-weight-bold text-warning">{{ pendingOrders }} </p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>✅ Delivered</h3>
              <p class="text-h6 font-weight-bold text-success">{{ deliveredOrders }} </p>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4">
              <h3>❌ Canceled</h3>
              <p class="text-h6 font-weight-bold text-error">{{ canceledOrders }} </p>
            </v-card>
          </v-col>
        </v-row>


                <div class="d-flex justify-space-between align-center mt-10 mb-4">
          
          <v-btn color="success" variant="elevated" class="rounded-pill" @click="$router.push('/OrderView')">
            My Orders
          </v-btn>
        </div>

        <v-card class="rounded-xl elevation-4">
          <v-sheet color="success" class="pa-4 rounded-t-xl">
            <h4 class="text-white mb-0">🗂 Recent Orders</h4>
          </v-sheet>

          <v-data-table
            :headers="[ 
              { text: 'Name', value: 'name' },
              { text: 'Quantity', value: 'quantity' },
              { text: 'Total Price', value: 'total_price' },
              { text: 'Status', value: 'status' },
            ]"
            :items="recentOrders"
            hide-default-footer
            class="elevation-0"
            density="compact"
          >
            <template #item.status="{ item }">
              <v-chip
                :color="item.status === 'Delivered'
                  ? 'success'
                  : item.status === 'Pending'
                  ? 'warning'
                  : 'error'"
                size="small"
                class="text-white font-weight-medium"
                pill
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

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(200, 255, 200, 0.3);
}
</style>