<template>
  <div>
    <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-8">
      Contact Us
    </h2>
    
    <div class="max-w-2xl mx-auto">
      <Card padding="lg">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              v-model="form.firstName"
              label="First name"
              placeholder="Enter your first name"
              :error-message="getError('firstName')"
              required
            />
            
            <Input
              v-model="form.lastName"
              label="Last name"
              placeholder="Enter your last name"
              :error-message="getError('lastName')"
              required
            />
          </div>
          
          <Input
            v-model="form.email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            :error-message="getError('email')"
            required
          />
          
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              v-model="form.subject"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
              <option value="business">Business Inquiry</option>
              <option value="other">Other</option>
            </select>
            <p v-if="getError('subject')" class="mt-1 text-sm text-red-600">
              {{ getError('subject') }}
            </p>
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="6"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your message"
              required
            ></textarea>
            <p v-if="getError('message')" class="mt-1 text-sm text-red-600">
              {{ getError('message') }}
            </p>
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
              Send Message
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
                  Message sent successfully! We'll get back to you soon.
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
        </form>
      </Card>
      
      <!-- Contact information -->
      <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div class="text-center">
          <div class="flex items-center justify-center h-12 w-12 mx-auto bg-primary-100 rounded-xl">
            <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Email Us</h3>
          <p class="mt-2 text-gray-500">
            <a href="mailto:hello@example.com" class="text-primary-600 hover:text-primary-500">
              hello@example.com
            </a>
          </p>
        </div>
        
        <div class="text-center">
          <div class="flex items-center justify-center h-12 w-12 mx-auto bg-primary-100 rounded-xl">
            <svg class="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Visit Us</h3>
          <p class="mt-2 text-gray-500">
            123 Example Street<br>
            City, State 12345
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')
const validationErrors = ref({})

const canSubmit = computed(() => {
  return (
    form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    form.value.subject &&
    form.value.message &&
    !loading.value
  )
})

const getError = (field) => {
  return validationErrors.value[field]?.[0] || ''
}

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleSubmit = async () => {
  // Reset states
  success.value = false
  error.value = ''
  validationErrors.value = {}
  
  // Client-side validation
  const errors = {}
  
  if (!form.value.firstName) {
    errors.firstName = ['First name is required']
  }
  
  if (!form.value.lastName) {
    errors.lastName = ['Last name is required']
  }
  
  if (!form.value.email) {
    errors.email = ['Email is required']
  } else if (!validateEmail(form.value.email)) {
    errors.email = ['Invalid email format']
  }
  
  if (!form.value.subject) {
    errors.subject = ['Subject is required']
  }
  
  if (!form.value.message) {
    errors.message = ['Message is required']
  }
  
  if (Object.keys(errors).length > 0) {
    validationErrors.value = errors
    return
  }
  
  loading.value = true
  
  try {
    // Here you would typically call an API to send the contact form
    console.log('Sending contact form:', form.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    success.value = true
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to send message'
  } finally {
    loading.value = false
  }
}
</script>