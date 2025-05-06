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

const formAction = ref({
  ...formActionDefault,
})

// Optional: Can remove if not needed
const onLogin = () => {
  alert(JSON.stringify(formData.value, null, 2))
}

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Logged In.'
    router.replace('/system/dashboard')
  }

  // Reset form and loading state
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

  <v-form class="mt-5" ref="refVform" @submit.prevent="onFormSubmit">
    <div class="text-subtitle-1 text-medium-emphasis pt-5">Email</div>
    <v-text-field
      v-model="formData.email"
      density="compact"
      placeholder="Email address"
      prepend-inner-icon="mdi-email-outline"
      :rules="[requiredValidator, emailValidator]"
      variant="outlined"
    />

    <div
      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between text-green"
    >
      Password
    </div>
    <v-text-field
      v-model="formData.password"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isPasswordVisible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator]"
    />

    <v-btn class="mt-4" color="green" size="default" variant="tonal" block @click="onFormSubmit">
      Log In
    </v-btn>
  </v-form>
</template>
