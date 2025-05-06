<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const orders = ref([])
const showOrderDialog = ref(false)
const selectedOrderId = ref(null)
const quantity = ref(1)

const fetchOrders = async () => {
  const { data, error } = await supabase.from('Orders').select('*')
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
      status: 'Delivered',
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
  <v-container fluid class="pa-5">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="5" class="pa-6 rounded-xl shadow-lg">
          <v-card-title class="text-h5 font-weight-bold text-center mb-4">
            📦 My Orders
          </v-card-title>

          <v-divider class="my-4" />

          <v-card-subtitle class="text-h6 font-weight-medium mb-4 text-center">
            🛒 Ordered Products
          </v-card-subtitle>

          <!-- Virtualized Data Table -->
          <v-data-table-virtual
            :headers="headers"
            :items="orders"
            item-value="order_item_id"
            height="400"
            class="elevation-1"
            fixed-header
            density="comfortable"
          >
            <template #no-data>
              <div class="text-center text-grey pa-6">No orders found.</div>
            </template>

            <template #item.status="{ item }">
              <v-chip
                small
                :color="
                  {
                    Pending: 'orange',
                    Delivered: 'green',
                    Canceled: 'red',
                  }[item.status] || 'grey'
                "
                text-color="white"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template #item.actions="{ item }">
              <v-tooltip text="Edit Order">
                <template #activator="{ on, attrs }">
                  <v-btn icon size="small" v-bind="attrs" v-on="on" @click="openEditDialog(item)">
                    <v-icon>mdi-calendar-edit</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Cancel Order">
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    size="small"
                    color="red"
                    v-bind="attrs"
                    v-on="on"
                    @click="cancelOrder(item.order_item_id)"
                  >
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </template>
          </v-data-table-virtual>

          <v-card-actions class="mt-4 justify-start">
            <v-btn color="primary" rounded class="text-white">View History</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Order Dialog -->
    <v-dialog v-model="showOrderDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-medium">
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
          <v-btn color="green" variant="flat" @click="markAsDelivered(selectedOrderId)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Global styles */
.v-card {
  background-color: #ffffff !important;
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.v-divider {
  border-color: #e0e0e0;
}

/* Table styles */
.v-data-table-virtual {
  border-radius: 12px;
}

.v-chip {
  font-size: 0.875rem;
}

.v-dialog {
  border-radius: 12px;
}

.v-card-subtitle {
  font-weight: 500;
  color: #555;
}

.v-card-actions .v-btn {
  background-color: #4caf50;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.v-card-actions .v-btn:hover {
  background-color: #45a049;
}
</style>
