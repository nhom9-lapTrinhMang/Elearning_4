<template>
  <AuthLayout>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reset your password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your new password below.
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <Input
          v-model="password"
          type="password"
          label="New password"
          placeholder="Enter your new password"
          :error-message="passwordError"
          help-text="Must be at least 8 characters with letters, numbers"
          required
          autocomplete="new-password"
        />

        <Input
          v-model="passwordConfirmation"
          type="password"
          label="Confirm new password"
          placeholder="Confirm your new password"
          :error-message="passwordConfirmationError"
          required
          autocomplete="new-password"
        />
      </div>

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          :loading="loading"
          :disabled="!canSubmit"
        >
          Reset password
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
              Password reset successful! You can now sign in with your new password.
            </h3>
            <div class="mt-3">
              <router-link
                to="/login"
                class="text-sm font-medium text-green-800 hover:text-green-600"
              >
                Go to sign in →
              </router-link>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { authApi } from '@/api/auth'

const route = useRoute()
const router = useRouter()

const token = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')
const passwordError = ref('')
const passwordConfirmationError = ref('')

const canSubmit = computed(() => {
  return password.value && passwordConfirmation.value && !loading.value
})

const validatePassword = (pwd) => {
  if (pwd.length < 8) return 'Password must be at least 8 characters'
  if (!/(?=.*[a-z])/.test(pwd)) return 'Password must contain at least one lowercase letter'
  if (!/(?=.*[A-Z])/.test(pwd)) return 'Password must contain at least one uppercase letter'
  if (!/(?=.*\d)/.test(pwd)) return 'Password must contain at least one number'
  return ''
}

const handleSubmit = async () => {
  // Reset errors
  error.value = ''
  passwordError.value = ''
  passwordConfirmationError.value = ''
  
  // Validate password
  const passwordValidation = validatePassword(password.value)
  if (passwordValidation) {
    passwordError.value = passwordValidation
    return
  }
  
  // Validate password confirmation
  if (password.value !== passwordConfirmation.value) {
    passwordConfirmationError.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  
  try {
    const result = await authApi.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    
    if (result.success) {
      success.value = true
      // Optionally redirect after a delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      error.value = result.message || 'Failed to reset password'
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Get token and email from query parameters
  token.value = route.query.token || ''
  email.value = route.query.email || ''
  
  // Redirect to forgot password if no token
  if (!token.value) {
    router.push('/forgot-password')
  }
})
</script>