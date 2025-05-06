<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const orders = ref([])
const showOrderDialog = ref(false)
const selectedOrderId = ref(null)
const quantity = ref(1)

const fetchOrders = async () => {
  const { data, error } = await supabase.from('Orders').select('*').in('status', ['Pending'])
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
            </template></v-data-table-virtual
          ></v-card
        ></v-col
      ></v-row
    ></v-container
  >
</template>
