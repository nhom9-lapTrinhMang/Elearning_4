<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
      <p class="text-gray-600">Manage your account settings and personal information</p>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 bg-green-50 border border-green-200 rounded-md p-4"
    >
      <div class="flex">
        <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button @click="successMessage = ''" class="text-green-400 hover:text-green-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Image Section -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
          
          <div class="text-center">
            <div class="relative inline-block">
              <img
                :src="form.avatar || '/images/default-avatar.png'"
                :alt="form.name"
                class="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              >
              <button
                @click="$refs.avatarInput.click()"
                class="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
            
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              class="hidden"
            >
            
            <p class="mt-3 text-sm text-gray-500">
              Click the camera icon to change your profile picture
            </p>
          </div>
        </div>

        <!-- Account Stats -->
        <div class="bg-white shadow rounded-lg p-6 mt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Account Statistics</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Blogs</span>
              <span class="font-semibold">{{ stats.totalBlogs }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Published</span>
              <span class="font-semibold text-green-600">{{ stats.publishedBlogs }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Drafts</span>
              <span class="font-semibold text-yellow-600">{{ stats.draftBlogs }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Total Views</span>
              <span class="font-semibold">{{ stats.totalViews }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Member Since</span>
              <span class="font-semibold">{{ formatDate(user?.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Form Section -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Personal Information</h2>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6 space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': errors.name }"
              >
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': errors.email }"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Bio -->
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <!-- Website -->
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                v-model="form.website"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://yourwebsite.com"
              >
            </div>

            <!-- Social Links -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="twitter" class="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  id="twitter"
                  v-model="form.twitter"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="@username"
                >
              </div>

              <div>
                <label for="linkedin" class="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  v-model="form.linkedin"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="linkedin.com/in/username"
                >
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="loading"
                class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
                <span v-else>Update Profile</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white shadow rounded-lg mt-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
          </div>
          
          <form @submit.prevent="changePassword" class="p-6 space-y-6">
            <!-- Current Password -->
            <div>
              <label for="current_password" class="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': passwordErrors.current_password }"
              >
              <p v-if="passwordErrors.current_password" class="mt-1 text-sm text-red-600">{{ passwordErrors.current_password }}</p>
            </div>

            <!-- New Password -->
            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="new_password"
                v-model="passwordForm.new_password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': passwordErrors.new_password }"
              >
              <p v-if="passwordErrors.new_password" class="mt-1 text-sm text-red-600">{{ passwordErrors.new_password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirm_password"
                v-model="passwordForm.confirm_password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-300': passwordErrors.confirm_password }"
              >
              <p v-if="passwordErrors.confirm_password" class="mt-1 text-sm text-red-600">{{ passwordErrors.confirm_password }}</p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading"
                class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="passwordLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing...
                </span>
                <span v-else>Change Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useForm } from '@/composables/useForm'

const { user, updateProfile: updateUserProfile, changePassword: updatePassword } = useAuth()

// Profile form
const form = reactive({
  name: '',
  email: '',
  bio: '',
  website: '',
  twitter: '',
  linkedin: '',
  avatar: ''
})

const { errors, loading, validateAndSubmit } = useForm()

// Password form
const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const passwordErrors = ref({})
const passwordLoading = ref(false)

// Stats
const stats = reactive({
  totalBlogs: 0,
  publishedBlogs: 0,
  draftBlogs: 0,
  totalViews: 0
})

const successMessage = ref('')

// Methods
const updateProfile = async () => {
  const success = await validateAndSubmit(async () => {
    const result = await updateUserProfile(form)
    if (result.success) {
      successMessage.value = 'Profile updated successfully!'
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
    return result
  })
}

const changePassword = async () => {
  passwordErrors.value = {}
  
  // Validate passwords
  if (!passwordForm.current_password) {
    passwordErrors.value.current_password = 'Current password is required'
    return
  }
  
  if (!passwordForm.new_password) {
    passwordErrors.value.new_password = 'New password is required'
    return
  }
  
  if (passwordForm.new_password.length < 8) {
    passwordErrors.value.new_password = 'New password must be at least 8 characters'
    return
  }
  
  if (passwordForm.new_password !== passwordForm.confirm_password) {
    passwordErrors.value.confirm_password = 'Passwords do not match'
    return
  }

  passwordLoading.value = true
  
  try {
    const result = await updatePassword({
      current_password: passwordForm.current_password,
      new_password: passwordForm.new_password
    })
    
    if (result.success) {
      successMessage.value = 'Password changed successfully!'
      // Reset password form
      passwordForm.current_password = ''
      passwordForm.new_password = ''
      passwordForm.confirm_password = ''
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      passwordErrors.value.current_password = result.message || 'Failed to change password'
    }
  } catch (error) {
    passwordErrors.value.current_password = 'An error occurred while changing password'
  } finally {
    passwordLoading.value = false
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const loadUserStats = async () => {
  // In a real app, this would fetch from the API
  try {
    // Mock data for now
    stats.totalBlogs = 15
    stats.publishedBlogs = 12
    stats.draftBlogs = 3
    stats.totalViews = 1250
  } catch (error) {
    console.error('Failed to load user stats:', error)
  }
}

// Initialize form with user data
const initializeForm = () => {
  if (user.value) {
    form.name = user.value.name || ''
    form.email = user.value.email || ''
    form.bio = user.value.bio || ''
    form.website = user.value.website || ''
    form.twitter = user.value.twitter || ''
    form.linkedin = user.value.linkedin || ''
    form.avatar = user.value.avatar || ''
  }
}

onMounted(() => {
  initializeForm()
  loadUserStats()
})
</script>