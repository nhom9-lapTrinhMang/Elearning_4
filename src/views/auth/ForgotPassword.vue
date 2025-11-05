<template>
  <AuthLayout>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Forgot your password?
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div>
        <Input
          v-model="email"
          type="email"
          label="Email address"
          placeholder="Enter your email"
          :error-message="emailError"
          required
          autocomplete="email"
        />
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="loading"
          :disabled="!email || loading"
        >
          Send reset link
        </Button>
      </div>

      <!-- Success message -->
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <svg
            class="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">
              Reset link sent! Check your email for further instructions.
            </h3>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ error }}
            </h3>
          </div>
        </div>
      </div>

      <div class="text-center">
        <router-link
          to="/login"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          Back to sign in
        </router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { authApi } from '@/api/auth'

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')
const emailError = ref('')

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleSubmit = async () => {
  // Reset states
  success.value = false
  error.value = ''
  emailError.value = ''
  
  // Validate email
  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  
  if (!validateEmail(email.value)) {
    emailError.value = 'Invalid email format'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authApi.forgotPassword(email.value)
    
    if (result.success) {
      success.value = true
      email.value = ''
    } else {
      error.value = result.message || 'Failed to send reset link'
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>