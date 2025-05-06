<script setup>
import { ref } from 'vue'
import loginform from '@/assets/components/auth/loginform.vue'
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="4" md="4">
        <v-img class="image">
          <img src="@/assets/images/Logo.png" width="500" alt="Logo" />
        </v-img>
      </v-col>
      <v-col cols="8" md="8">
        <v-card class="mx-auto mt-16 card" elevation="16" max-width="500">
          <v-card-item class="text-center pt-6">
            <v-card-title class="font-weight-black">Marketplace</v-card-title>
            <v-card-subtitle class="font-weight-light">LOG IN TO CONTINUE</v-card-subtitle>
          </v-card-item>
          <loginform></loginform>

          <v-card-text class="text-center text">
            New User?
            <router-link to="/Register" class="text-decoration-none">
              <a
                class="text-green text-decoration-none"
                href="#"
                rel="noopener noreferrer"
                target="_blank"
              >
                Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
              </a>
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.image {
  padding-top: 15%;
  padding-left: 5%;
  overflow: visible;
}
.card {
  border-radius: 25px;
  padding: 25px;
  margin-top: 10% !important;
  background-color: gainsboro;
}

body {
  background-color: beige;
}
.text {
  font-size: small;
}
* {
  font-family: 'Arial';
}
</style>
