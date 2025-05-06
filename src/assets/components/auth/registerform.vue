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
  Name: '',
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
    router.replace('/system/dashboard')
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

  <v-form class="mt-5" ref="refVform" @submit.prevent="onFormSubmit">
    <div class="text-subtitle-1 text-medium-emphasis">Name</div>
    <v-text-field
      v-model="formData.Name"
      density="compact"
      variant="outlined"
      :rules="[requiredValidator]"
    />

    <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    <v-text-field
      v-model="formData.email"
      density="compact"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      :rules="[requiredValidator, emailValidator]"
    />

    <div class="text-subtitle-1 text-medium-emphasis text-green">Password</div>
    <v-text-field
      v-model="formData.password"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      prepend-inner-icon="mdi-lock-outline"
      :type="isPasswordVisible ? 'text' : 'password'"
      density="compact"
      placeholder="*******"
      variant="outlined"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator, passwordValidator]"
    />

    <div class="text-subtitle-1 text-medium-emphasis text-green">Confirm Password</div>
    <v-text-field
      v-model="formData.password_confirmation"
      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
      prepend-inner-icon="mdi-lock-outline"
      :type="isPasswordConfirmVisible ? 'text' : 'password'"
      density="compact"
      placeholder="*******"
      variant="outlined"
      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
      :rules="[requiredValidator, confirmPasswordRule]"
    />

    <v-btn
      class="mt-4"
      color="green"
      size="default"
      variant="tonal"
      block
      type="submit"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Create
    </v-btn>
  </v-form>
</template>
