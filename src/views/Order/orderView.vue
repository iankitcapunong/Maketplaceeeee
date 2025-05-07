<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'
import DashboardLayout from '../../assets/components/layout/DashboardLayout.vue'

const orders = ref([])
const showOrderDialog = ref(false)
const selectedOrderId = ref(null)
const quantity = ref(1)

const fetchOrders = async () => {
  const { data, error } = await supabase.from('Orders').select('*')
  .in('status', ['Pending'])
  if (error) {
    console.error('Error fetching Orders:', error)
  } else {
    orders.value = data
  }
}


const openEditDialog = (order) => {
  selectedOrderId.value = order.order_item_id
  quantity.value = order.quantity
  showOrderDialog.value = true
}

const markAsDelivered = async (order_item_id) => {
  const { error } = await supabase
    .from('Orders')
    .update({
      quantity: quantity.value,
    })
    .eq('order_item_id', order_item_id)

  if (error) {
    console.error('Error delivering order:', error)
    alert('Failed to update status.')
  } else {
    alert('Order marked as Delivered!')
    showOrderDialog.value = false
    fetchOrders()
  }
}

const headers = [
  { text: 'Product Name', align: 'start', key: 'name' },
  { text: 'Quantity', key: 'quantity' },
  { text: 'Total Price', key: 'total_price' },
  { text: 'Status', key: 'status' },
  { text: 'Actions', key: 'actions', sortable: false },
]

onMounted(fetchOrders)
</script>

<template>
  <DashboardLayout>
    <template #default>
      <v-container fluid class="pa-6 ">
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 elevation-10 rounded-xl">
              <v-card-title class="text-h4 font-weight-bold text-primary text-center mb-1">
                📦 My Orders
              </v-card-title>

              <v-card-subtitle class="text-center text-body-1 text-medium-emphasis mb-4">
                🛒 Manage and track all your purchases with ease.
              </v-card-subtitle>

              <v-divider class="mb-4" />

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
                      <div class="">
                        <v-tooltip text="Edit Order">
                          <template #activator="{ on, attrs }">
                            <v-btn
                              icon
                              size="small"
                              color="primary"
                              class="mr-3"
                              v-bind="attrs"
                              v-on="on"
                              @click="openEditDialog(order)"
                            >
                              <v-icon size="18">mdi-calendar-edit</v-icon>
                            </v-btn>
                          </template>
                        </v-tooltip>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-divider class="my-4" />

              <v-row justify="end" class="pr-2 pb-1">
                <v-col cols="auto">
                  <router-link to="/orderhistory">
                    <v-btn color="primary" class="text-white px-6" rounded elevation="2">
                      View Order History
                    </v-btn>
                  </router-link>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="showOrderDialog" max-width="400">
          <v-card class="rounded-xl">
            <v-card-title class="text-h6 font-weight-bold">
              Update Quantity & Mark as Delivered
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="quantity"
                label="Quantity"
                type="number"
                min="1"
                density="comfortable"
                class="mb-4"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="showOrderDialog = false">Cancel</v-btn>
              <v-btn color="green" variant="flat" @click="markAsDelivered(selectedOrderId)">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
