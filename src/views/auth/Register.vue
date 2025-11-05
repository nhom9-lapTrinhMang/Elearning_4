<template>
  <AuthLayout>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link
          to="/login"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <Input
          v-model="registerForm.name"
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          :error-message="getError('name')"
          required
          autocomplete="name"
        />

        <Input
          v-model="registerForm.email"
          type="email"
          label="Email address"
          placeholder="Enter your email"
          :error-message="getError('email')"
          required
          autocomplete="email"
        />

        <Input
          v-model="registerForm.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :error-message="getError('password')"
          help-text="Must be at least 8 characters with letters, numbers"
          required
          autocomplete="new-password"
        />

        <Input
          v-model="registerForm.password_confirmation"
          type="password"
          label="Confirm password"
          placeholder="Confirm your password"
          :error-message="getError('password_confirmation')"
          required
          autocomplete="new-password"
        />
      </div>

      <div class="flex items-center">
        <input
          id="terms"
          v-model="registerForm.terms"
          name="terms"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          :class="{ 'border-red-300': getError('terms') }"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-900">
          I agree to the
          <router-link to="/terms" class="text-primary-600 hover:text-primary-500">
            Terms and Conditions
          </router-link>
          and
          <router-link to="/privacy" class="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </router-link>
        </label>
      </div>
      
      <div v-if="getError('terms')" class="text-sm text-red-600">
        {{ getError('terms') }}
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
          Create account
        </Button>
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
    </form>
  </AuthLayout>
</template>

<script setup>
import { computed } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { useAuth } from '@/composables/useAuth'

const {
  registerForm,
  register,
  loading,
  error,
  validationErrors,
  clearErrors
} = useAuth()

const canSubmit = computed(() => {
  return (
    registerForm.value.name &&
    registerForm.value.email &&
    registerForm.value.password &&
    registerForm.value.password_confirmation &&
    registerForm.value.terms &&
    !loading.value
  )
})

const getError = (field) => {
  return validationErrors.value[field]?.[0] || ''
}

const handleSubmit = async () => {
  clearErrors()
  await register()
}
</script>