<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase, formActionDefault } from '@/utils/supabase'
import AlertNotification from '@/assets/common/AlertNotification.vue'

const router = useRouter()

// Default form values
const formDataDefault = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVform = ref()

// Reactive validator for password confirmation
const confirmPasswordRule = computed(() =>
  confirmedValidator(formData.value.password_confirmation, formData.value.password),
)

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        name: formData.value.Name,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered Account.'
    router.replace('/maindashboard')
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

  <v-form ref="refVform" @submit.prevent="onFormSubmit" class="register-form">
    <v-text-field
      v-model="formData.name"
      label="Name"
      density="comfortable"
      variant="outlined"
      :rules="[requiredValidator]"
      class="mb-5"
      clearable
      prepend-inner-icon="mdi-account"
    />

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

    <v-text-field
      v-model="formData.password"
      label="Password"
      placeholder="*******"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isPasswordVisible ? 'text' : 'password'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator, passwordValidator]"
      variant="outlined"
      density="comfortable"
      class="mb-5"
      clearable
    />

    <v-text-field
      v-model="formData.password_confirmation"
      label="Confirm Password"
      placeholder="*******"
      prepend-inner-icon="mdi-lock-outline"
      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="isPasswordConfirmVisible ? 'text' : 'password'"
      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
      :rules="[requiredValidator, confirmPasswordRule]"
      variant="outlined"
      density="comfortable"
      class="mb-6"
      clearable
    />

    <v-btn
      color="green"
      variant="flat"
      block
      size="large"
      class="rounded-lg"
      :loading="formAction.formProcess"
      :disabled="formAction.formProcess"
      @click="onFormSubmit"
      prepend-icon="mdi-account-plus"
    >
      Create Account
    </v-btn>
  </v-form>
</template>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
}

.v-form {
  width: 100%;
}

.v-text-field {
  max-width: 100%;
}

.mb-5 {
  margin-bottom: 1.5rem;
}

.mb-6 {
  margin-bottom: 2rem;
}

.v-btn {
  margin-top: 20px;
}

.text-green {
  color: #4caf50;
}
</style>
