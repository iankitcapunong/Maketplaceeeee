<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

// reactive variables
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

const cancelOrder = async (orderId) => {
  await supabase.from('Orders').delete().eq('order_item_id', orderId)
  fetchOrders()
}

const updateOrderStatus = async (order_item_id) => {
  const { data, error } = await supabase
    .from('Orders')
    .update({ status: 'Canceled' })
    .eq('order_item_id', order_item_id)

  if (error) {
    console.error('Error updating order status:', error)
  } else {
    fetchOrders()
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
        status: 'Delivered' })
    .eq('order_item_id', order_item_id)

  if (error) {
    console.error('Error delivering order:', error)
    alert("Failed to update status.")
  } else {
    alert("Order marked as Delivered!")
    fetchOrders()
  }
}


onMounted(fetchOrders)
</script>


<template>
  <v-row>
    <v-col cols="12" class="px-6 pt-2">
      <h2 class="text-h5 font-weight-bold mb-6 text-center">📦 My Orders</h2>

      <h1>🛒 Ordered Products</h1>

      <v-divider class="my-2" />

      <v-card>
        <v-card-text class="overflow-y-auto flex-grow-1 px-0">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.order_item_id">
                <td>{{ order.name }}</td>
                <td>{{ order.quantity }}</td>
                <td>₱ {{ order.total_price }}</td>
                <td>
                  <v-chip :color="order.status === 'Pending' ? 'orange' : 'grey'" text-color="white" small>
                    {{ order.status }}
                  </v-chip>
                </td>
                <td>
                  <v-btn class="mr-2" icon size="x-small" @click="openEditDialog(order)">
                    <v-icon size="16">mdi-calendar-edit</v-icon>
                  </v-btn>
                  <v-btn icon size="x-small" color="red" @click="updateOrderStatus(order.order_item_id)">
                    <v-icon size="16">mdi-cancel</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-divider class="mt-2" />
        <div class="d-flex justify-start" style="position: absolute; bottom: 16px; left: 16px;">
          <v-btn color="green" rounded class="text-white" >
            View History
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <!-- Edit Order Dialog -->
  <v-dialog v-model="showOrderDialog" max-width="400">
    <v-card>
      <v-card-title>Edit Quantity</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="quantity"
          label="Quantity"
          type="number"
          min="1"
          density="compact"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showOrderDialog = false">Cancel</v-btn>
        <v-btn color="green" text @click="markAsDelivered(selectedOrderId)">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
