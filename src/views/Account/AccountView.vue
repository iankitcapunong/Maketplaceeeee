<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/utils/supabase'
import DashboardLayout from '../../assets/components/layout/DashboardLayout.vue'

const isEditing = ref(false)
const imageFile = ref(null)
const imageUrl = ref('')
const originalAvatarUrl = ref('') // 🆕 to store original image for cancel

const userData = ref({
  email: '',
  name: '',
  address: '',
  contactNo: '',
  birth_date: '',
  location: '',
  avatar_url: '',
})

const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    userData.value.email = user.email
    userData.value.name = user.user_metadata?.name || ''
    userData.value.address = user.user_metadata?.address || ''
    userData.value.contactNo = user.user_metadata?.contactNo || ''
    userData.value.birth_date = user.user_metadata?.birth_date || ''
    userData.value.avatar_url = user.user_metadata?.avatar_url || ''

    if (userData.value.avatar_url) {
      imageUrl.value = userData.value.avatar_url
      originalAvatarUrl.value = userData.value.avatar_url // store original
    }
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  imageFile.value = file
  if (file) {
    imageUrl.value = URL.createObjectURL(file) // Show preview immediately
  }
}

const uploadImage = async () => {
  if (!imageFile.value) return null

  const file = imageFile.value
  const filePath = `avatar/${Date.now()}_${file.name}`

  const { error } = await supabase.storage.from('product-images').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    alert('Upload failed!')
    console.error(error)
    return null
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)

  imageUrl.value = data.publicUrl
  return data.publicUrl
}

const toggleEdit = async () => {
  if (isEditing.value) {
    // Save
    const uploadedImageUrl = await uploadImage()
    const updatedData = {
      name: userData.value.name,
      address: userData.value.address,
      contactNo: userData.value.contactNo,
      birth_date: userData.value.birth_date,
      avatar_url: uploadedImageUrl || userData.value.avatar_url,
    }

    const { error } = await supabase.auth.updateUser({ data: updatedData })

    if (error) {
      alert('Failed to save.')
    } else {
      alert('Traveler profile saved successfully!')
      await getUser()
    }
  } else {
    // Cancel edit: restore original image preview
    imageUrl.value = originalAvatarUrl.value
    imageFile.value = null
  }

  isEditing.value = !isEditing.value
}

onMounted(getUser)
</script>

<template>
  <DashboardLayout>
    <template #default>
      <v-container fluid class="pa-4">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <h2 class="text-h5 font-weight-bold mb-6 text-center">👤 Profile Settings</h2>

            <v-card class="pa-6 rounded-xl" elevation="1" style="border: 1px solid #e5e5e5">
              <div class="d-flex align-center mb-6">
                <v-avatar size="96" class="elevation-1" style="border: 3px solid #ccc">
                  <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    alt="Avatar"
                    class="rounded-circle"
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                  <v-icon v-else size="64" color="grey">mdi-account</v-icon>
                </v-avatar>

                <div class="ms-4">
                  <div class="text-subtitle-1 font-weight-medium mb-2">
                    {{ userData.name || 'Your Name' }}
                  </div>
                  <v-btn
                    v-if="isEditing"
                    variant="text"
                    color="primary"
                    class="text-capitalize px-0"
                    @click="$refs.fileInput.click()"
                  >
                    Change Photo
                  </v-btn>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="handleFileChange"
                  />
                </div>
              </div>

              <v-divider class="mb-6"></v-divider>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Full Name"
                    v-model="userData.name"
                    :disabled="!isEditing"
                    variant="plain"
                    hide-details
                    class="modern-field"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Address"
                    v-model="userData.address"
                    :disabled="!isEditing"
                    variant="plain"
                    hide-details
                    class="modern-field"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Email"
                    v-model="userData.email"
                    disabled
                    append-inner-icon="mdi-check-circle"
                    color="success"
                    variant="plain"
                    hide-details
                    class="modern-field"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Contact No."
                    v-model="userData.contactNo"
                    :disabled="!isEditing"
                    variant="plain"
                    hide-details
                    class="modern-field"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-date-input
                    label="Birthday"
                    type="birth_date"
                    v-model="userData.birth_date"
                    :disabled="!isEditing"
                    variant="plain"
                    hide-details
                    class="modern-field"
                  />
                </v-col>
              </v-row>

              <v-divider class="mt-6 mb-4"></v-divider>
              <div class="d-flex justify-end">
                <v-btn variant="flat" color="primary" class="text-capitalize" @click="toggleEdit">
                  {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </DashboardLayout>
</template>
