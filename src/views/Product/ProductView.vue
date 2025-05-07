<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/utils/supabase.js'
import DashboardLayout from '../../assets/components/layout/DashboardLayout.vue'

const products = ref([])
const dialog = ref(false)
const selectedProduct = ref(null)
const quantity = ref(1)
const search = ref('')

const fetchProducts = async () => {
  const { data, error } = await supabase.from('Products').select('*')

  if (error) {
    console.error('Error fetching products:', error)
  } else {
    products.value = data
  }
}

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const openOrderDialog = (product) => {
  selectedProduct.value = product
  quantity.value = 1
  dialog.value = true
}

const placeOrder = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    showSnackbar('Please log in to place an order.')
    return
  }
  const total_price = selectedProduct.value.price * quantity.value
  const { data, error } = await supabase
    .from('Orders')
    .insert([
      {
        user_id: user.id,
        quantity: quantity.value,
        price: selectedProduct.value.price,
        image_url: selectedProduct.value.image_url,
        name: selectedProduct.value.name,
        type: selectedProduct.value.type,
        status: 'Pending',
      },
    ])
    .select()

  if (error) {
    console.error('Order failed:', error)
    showSnackbar('Failed to place order.')
  } else {
    showSnackbar('Order placed successfully!')
    dialog.value = false
  }
}

const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')
const snackbarIcon = ref('mdi-check-circle')

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbarIcon.value = color === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'
  snackbar.value = true
}

onMounted(fetchProducts)
</script>

<template>
  <DashboardLayout>
    <template #default>
      <v-container fluid class="py-8">
        <v-row justify="center" class="text-center mb-4">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold text-green-darken-2 mb-1">🛒 Shop Our Products</h2>
            <p class="text-subtitle-1 text-grey-darken-1">
              Select your favorite items and order instantly!
            </p>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Search for food..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              color="green"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="product in filteredProducts"
            :key="product.product_id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="elevation-1 rounded-lg pa-4 d-flex flex-column justify-between hover:elevation-5 transition-all"
              style="min-height: 100%; background-color: #ffffff"
            >
              <v-img :src="product.image_url" height="200" class="rounded mb-3" cover />

              <h3 class="text-subtitle-1 font-weight-medium mb-1">{{ product.name }}</h3>
              <p class="text-caption text-grey-darken-1 mb-1">{{ product.type }}</p>
              <p class="text-caption mb-1">
                Stock: <strong>{{ product.stock }}</strong>
              </p>
              <p class="text-subtitle-2 text-green-darken-2 font-weight-bold mb-3">
                ₱{{ product.price.toLocaleString() }}
              </p>

              <v-btn
                block
                color="green"
                class="rounded-pill text-white font-weight-medium"
                @click="openOrderDialog(product)"
              >
                Order Now
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="500" persistent>
          <v-card class="rounded-lg pa-4 elevation-2">
            <v-card-title class="text-h5 font-weight-bold text-green-darken-2 pb-2">
              Confirm Your Order
            </v-card-title>

            <v-card-text>
              <v-row no-gutters>
                <v-col cols="4" class="d-flex justify-center">
                  <v-img :src="selectedProduct?.image_url" height="90" class="rounded-sm" />
                </v-col>
                <v-col cols="8" class="ps-3">
                  <div class="text-body-1 font-weight-bold">{{ selectedProduct?.name }}</div>
                  <div class="text-caption text-grey-darken-2">{{ selectedProduct?.type }}</div>
                  <div class="text-subtitle-2 text-green-darken-2 mt-1">
                    ₱{{ selectedProduct?.price.toLocaleString() }}
                  </div>
                  <div class="text-caption mt-1">
                    Stock: <strong>{{ selectedProduct?.stock }}</strong>
                  </div>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <v-text-field
                v-model="quantity"
                type="number"
                label="Quantity"
                :rules="[(v) => v > 0 || 'Must be at least 1']"
                min="1"
                :max="selectedProduct?.stock"
                density="comfortable"
                color="green"
                class="mt-4"
                outlined
                hide-details
              />
            </v-card-text>

            <v-card-actions class="d-flex justify-end mt-4">
              <v-btn variant="text" @click="dialog = false" class="text-grey-darken-2"
                >Cancel</v-btn
              >
              <v-btn color="green" variant="contained" @click="placeOrder" class="ml-3 rounded-lg">
                Confirm Order
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          timeout="3000"
          location="top left"
          rounded="pill"
          elevation="8"
        >
          <template #default>
            <div class="text-center">
              <v-icon start size="20" class="me-2">{{ snackbarIcon }}</v-icon>
              <span>{{ snackbarMessage }}</span>
            </div>
          </template>
        </v-snackbar>
      </v-container>
    </template>
  </DashboardLayout>
</template>
