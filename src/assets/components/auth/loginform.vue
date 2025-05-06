<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, formActionDefault } from '@/utils/supabase'
import { requiredValidator, emailValidator } from '@/utils/validators'
import AlertNotification from '@/assets/common/AlertNotification.vue'

const router = useRouter()
const refVform = ref()
const isPasswordVisible = ref(false)

const formDataDefault = {
  email: '',
  password: '',
}
const formData = ref({ ...formDataDefault })

const formAction = ref({ ...formActionDefault })

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    formAction.value.formSuccessMessage = 'Successfully Logged In.'
    router.replace('/dashboard')
  }

  refVform.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form ref="refVform" @submit.prevent="onFormSubmit" class="login-form">
    <!-- Email Field -->
    <v-text-field
      v-model="formData.email"
      label="Email"
      placeholder="example@domain.com"
      prepend-inner-icon="mdi-email-outline"
      :rules="[requiredValidator, emailValidator]"
      variant="outlined"
      density="comfortable"
      class="mb-5"
      clearable
    />

    <!-- Password Field -->
    <v-text-field
      v-model="formData.password"
      :type="isPasswordVisible ? 'text' : 'password'"
      label="Password"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator]"
      variant="outlined"
      density="comfortable"
      class="mb-6"
      clearable
    />

    <!-- Login Button -->
    <v-btn
      color="green"
      variant="flat"
      block
      size="large"
      class="rounded-lg"
      :loading="formAction.formProcess"
      @click="onFormSubmit"
      prepend-icon="mdi-login"
    >
      Log In
    </v-btn>
  </v-form>
</template>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
