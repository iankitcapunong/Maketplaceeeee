<script setup>
import registerform from '@/assets/components/auth/registerform.vue'
</script>

<template>
  <v-container fluid class="register-bg d-flex align-center justify-center pa-0 ma-0">
    <v-row no-gutters align="center" justify="center" class="w-100">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card
          elevation="20"
          class="rounded-xl d-flex flex-row overflow-hidden"
          style="min-height: 600px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1)"
        >
          <!-- Left side (Logo) -->
          <v-col
            cols="12"
            md="5"
            class="pa-6 d-flex align-center justify-center"
            style="background-color: #e3f2fd"
          >
            <v-img src="/images/Logo.png" max-width="400" contain alt="Marketplace Logo" />
          </v-col>

          <!-- Right side (Form) -->
          <v-col
            cols="12"
            md="7"
            class="pa-8 d-flex flex-column justify-center align-center"
            style="background-color: #ffffff"
          >
            <div class="text-center mb-6" style="width: 100%">
              <h2 class="text-h5 font-weight-bold mb-1">Welcome to Marketplace</h2>
              <div class="text-subtitle-3 text-large-emphasis">Create your account</div>
            </div>

            <div class="register-form-container">
              <registerform />
            </div>

            <div class="text-center mt-4">
              <span class="text-body-2">Already have an account?</span>
              <router-link to="/" class="text-green font-weight-medium text-decoration-none">
                Log in now!
              </router-link>
            </div>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.register-bg {
  background-color: #f7f7f7;
  height: 100vh;
  overflow: hidden;
}

.v-card {
  background-color: white;
  border-radius: 16px;
}

.text-center {
  text-align: center;
}

.text-body-2 {
  font-size: 14px;
}

.text-green {
  color: #4caf50;
}

.text-subtitle-2 {
  font-size: 16px;
  color: #666;
}

.router-link-active {
  text-decoration: underline;
}

.v-img {
  max-width: 100%;
}

.v-col {
  padding: 0;
}

.v-btn {
  margin-top: 20px;
}

.register-form-container {
  width: 100%;
  max-width: 400px; /* Set a max width for the registration form */
}

.v-col.pa-8 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
