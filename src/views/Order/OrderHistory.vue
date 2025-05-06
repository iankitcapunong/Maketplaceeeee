<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import DashboardLayout from '../../assets/components/layout/DashboardLayout.vue'

// reactive variables
const orders = ref([])

const fetchOrders = async () => {
  const { data, error } = await supabase.from('Orders').select('*').in('status', ['Delivered'])
  if (error) {
    console.error('Error fetching Orders:', error)
  } else {
    orders.value = data
  }
}

const cancelOrder = async (order_item_id) => {
  await supabase.from('Orders').delete().eq('order_item_id', order_item_id)
  fetchOrders()
}

onMounted(fetchOrders)
</script>

<template>
  <DashboardLayout>
    <template #default>
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 elevation-10 rounded-xl">
              <!-- Page Header -->
              <v-card-title class="text-h4 font-weight-bold text-primary text-center mb-1">
                📦 Delivered Orders
              </v-card-title>
              <v-card-subtitle class="text-center text-body-1 text-medium-emphasis mb-4">
                View all your completed purchases below.
              </v-card-subtitle>

              <v-divider class="mb-4" />

              <!-- Table -->
              <v-table density="comfortable" class="v-table--striped text-center">
                <thead>
                  <tr>
                    <th class="text-center font-weight-bold">Product Name</th>
                    <th class="text-center font-weight-bold">Quantity</th>
                    <th class="text-center font-weight-bold">Total Price</th>
                    <th class="text-center font-weight-bold">Status</th>
                    <th class="text-center font-weight-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.order_item_id">
                    <td>{{ order.name }}</td>
                    <td>{{ order.quantity }}</td>
                    <td>₱ {{ order.total_price }}</td>
                    <td>
                      <v-chip
                        size="small"
                        :color="
                          {
                            Pending: 'orange',
                            Delivered: 'green',
                            Canceled: 'red',
                          }[order.status] || 'grey'
                        "
                        text-color="white"
                        class="font-weight-medium"
                      >
                        {{ order.status }}
                      </v-chip>
                    </td>
                    <td>
                      <v-tooltip text="Delete Order">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            icon
                            size="small"
                            color="red"
                            v-bind="attrs"
                            v-on="on"
                            @click="cancelOrder(order.order_item_id)"
                          >
                            <v-icon size="18">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <!-- No orders -->
              <div v-if="orders.length === 0" class="text-center py-6 text-medium-emphasis">
                No delivered orders to show.
              </div>

              <!-- CTA -->
              <v-divider class="my-4" />
              <v-row justify="end" class="pr-4 pb-2">
                <v-col cols="auto">
                  <router-link to="/OrderView">
                    <v-btn color="primary" rounded elevation="2" class="text-white px-6">
                      View All Orders
                    </v-btn>
                  </router-link>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </DashboardLayout>
</template>

<style scoped>
.v-card {
  background-color: #fff;
}

.v-chip {
  text-transform: capitalize;
}

.v-btn {
  transition: 0.3s ease;
}

.v-table--striped tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}
</style>
