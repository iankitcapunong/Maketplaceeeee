<script setup>
import registerform from '@/assets/components/auth/registerform.vue'
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
        <v-card class="mx-auto mt-13 card-2" elevation="16" max-width="500">
          <v-card-item class="text-center pt-2">
            <v-card-title class="font-weight-black">Marketplace</v-card-title>
            <v-card-subtitle class="font-weight-light">CREATE ACCOUNT</v-card-subtitle>
          </v-card-item>
          <registerform></registerform>
          <v-card-text class="text-center text">
            Already user?
            <router-link to="/" class="text-green text-decoration-none">
              Log In <v-icon icon="mdi-chevron-right" />
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
.card-2 {
  border-radius: 25px;
  padding: 25px;
  background-color: gainsboro;
}
.text {
  font-size: small;
}
</style>
