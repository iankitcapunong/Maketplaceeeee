<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase.js'

const products = ref([])
const dialog = ref(false)
const selectedProduct = ref(null)
const quantity = ref(1)

const fetchProducts = async () => {
  const { data, error } = await supabase.from('Products').select('*')
  if (error) {
    console.error('Error fetching products:', error)
  } else {
    products.value = data
  }
}

const openOrderDialog = (product) => {
  selectedProduct.value = product
  quantity.value = 1
  dialog.value = true
}

const placeOrder = async () => {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    alert("Please log in to place an order.")
    return
  }

  const total_price = selectedProduct.value.price * quantity.value

  const { data, error } = await supabase
  .from('Orders')
  .insert([{
    user_id: user.id,
    quantity: quantity.value,
    price: selectedProduct.value.price,
    image_url: selectedProduct.value.image_url,
    name: selectedProduct.value.name,
    type: selectedProduct.value.type
  }])
  .select()



  if (error) {
    console.error('Order failed:', error)
    alert("Failed to place order.")
  } else {
    alert("Order placed successfully!")
    dialog.value = false
  }
}

onMounted(fetchProducts)
</script>



<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="px-6 pt-6">
        <h2 class="text-h5 font-weight-bold mb-6 text-center">🌱 Shopping</h2>
        <v-row dense>
          <v-col
            v-for="product in products"
            :key="product.product_id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="rounded-xl elevation-5 pa-3 transition-all hover:shadow-xl">
              <v-img
                :src="product.image_url"
                height="160"
                class="rounded-lg mb-3"
                cover
              ></v-img>

              <div class="text-subtitle-1 font-weight-medium mb-2">{{ product.name }}</div>
              <div class="text-caption text-grey-darken-1 mb-2">{{ product.type }}</div>
              <div class="text-caption text-grey mb-2">Stock: {{ product.stock }}</div>
              <div class="text-green font-weight-bold mb-4">₱{{ product.price }}</div>

              <v-btn block color="green" variant="flat" class="rounded-pill"
                @click="openOrderDialog(product)">
                Order Now
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card class="rounded-xl pa-6">
      <v-card-title class="text-h6 font-weight-bold">
        Place Order
      </v-card-title>

      <v-card-text>
        <div v-if="selectedProduct">
          <p><strong>Product:</strong> {{ selectedProduct.name }}</p>
          <p><strong>Price:</strong> ₱{{ selectedProduct.price }}</p>
          <p><strong>Stock:</strong> {{ selectedProduct.stock }}</p>

          <v-text-field
            v-model="quantity"
            type="number"
            label="Quantity"
            :rules="[(v) => v > 0 || 'Must be at least 1']"
            min="1"
            :max="selectedProduct.stock"
            color="green"
            class="mt-4"
          />
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="green" variant="flat" @click="placeOrder">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
