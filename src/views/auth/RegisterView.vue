<script setup>
import registerform from '@/assets/components/auth/registerform.vue'
</script>

<template>
  <v-container fluid class="register-bg d-flex align-center justify-center pa-4">
    <v-row no-gutters align="center" justify="center" class="w-100">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card
          elevation="20"
          class="rounded-xl overflow-hidden d-flex flex-column flex-md-row"
          style="box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1)"
        >
          <!-- Left side (Logo) -->
          <div
            class="pa-6 d-flex align-center justify-center flex-grow-1"
            style="background-color: #e3f2fd"
          >
            <v-img src="/images/Logo.png" max-width="300" class="mx-auto" alt="Marketplace Logo" />
          </div>

          <!-- Right side (Form) -->
          <div
            class="form-side pa-8 d-flex flex-column justify-center align-center flex-grow-1"
            style="background-color: #ffffff"
          >
            <div class="text-center mb-6 w-100">
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
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.register-bg {
  background-color: #f7f7f7;
  height: 100vh;
  overflow-y: auto;
}

.v-card {
  border-radius: 16px;
}

.logo-side {
  background-color: #e3f2fd;
}

.form-side {
  background-color: #ffffff;
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

.router-link-active {
  text-decoration: underline;
}

.v-img {
  width: 100%;
  max-width: 100%;
  height: auto;
}

.register-form-container {
  width: 100%;
  max-width: 400px;
}
</style>
