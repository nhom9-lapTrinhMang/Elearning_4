<template>
  <footer class="bg-gray-50 border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="xl:grid xl:grid-cols-3 xl:gap-8">
        <!-- Brand section -->
        <div class="space-y-8 xl:col-span-1">
          <div class="flex items-center space-x-2">
            <img
              v-if="logo"
              :src="logo"
              :alt="appName"
              class="h-8 w-auto"
            />
            <span class="text-xl font-bold text-gray-900">
              {{ appName }}
            </span>
          </div>
          
          <p class="text-gray-500 text-base max-w-md">
            {{ description }}
          </p>
          
          <!-- Social links -->
          <div class="flex space-x-6">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <span class="sr-only">{{ social.name }}</span>
              <component
                :is="social.icon"
                class="h-6 w-6"
              />
            </a>
          </div>
        </div>
        
        <!-- Links sections -->
        <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <!-- Company links -->
            <div>
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Company
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in companyLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </div>
            
            <!-- Support links -->
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Support
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in supportLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="md:grid md:grid-cols-2 md:gap-8">
            <!-- Product links -->
            <div>
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Product
              </h3>
              <ul class="mt-4 space-y-4">
                <li v-for="item in productLinks" :key="item.name">
                  <router-link
                    :to="item.href"
                    class="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </div>
            
            <!-- Newsletter -->
            <div class="mt-12 md:mt-0">
              <h3 class="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Subscribe to our newsletter
              </h3>
              <p class="mt-4 text-base text-gray-500">
                Get the latest news and updates delivered to your inbox.
              </p>
              <form class="mt-4 sm:flex sm:max-w-md" @submit.prevent="handleSubscribe">
                <label for="email-address" class="sr-only">Email address</label>
                <input
                  id="email-address"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
                <div class="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <Button
                    type="submit"
                    variant="primary"
                    :loading="subscribing"
                  >
                    Subscribe
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom section -->
      <div class="mt-12 border-t border-gray-200 pt-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex space-x-6 md:order-2">
            <router-link
              v-for="item in legalLinks"
              :key="item.name"
              :to="item.href"
              class="text-gray-400 hover:text-gray-500 text-sm transition-colors duration-200"
            >
              {{ item.name }}
            </router-link>
          </div>
          
          <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {{ currentYear }} {{ appName }}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from '../ui/Button.vue'
import { APP_CONFIG } from '@/config'

const email = ref('')
const subscribing = ref(false)

const appName = APP_CONFIG.name
const description = APP_CONFIG.description || 'Building modern web applications with Vue 3'
const logo = '/logo.png' // Add your logo path

const currentYear = computed(() => new Date().getFullYear())

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'Twitter',
    href: '#',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'GitHub',
    href: '#',
    icon: 'svg' // Replace with actual icon component
  }
]

const companyLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Careers', href: '/careers' },
  { name: 'Press', href: '/press' }
]

const supportLinks = [
  { name: 'Help Center', href: '/help' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Status', href: '/status' },
  { name: 'Documentation', href: '/docs' }
]

const productLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'API', href: '/api' },
  { name: 'Integrations', href: '/integrations' }
]

const legalLinks = [
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' }
]

const handleSubscribe = async () => {
  if (!email.value) return
  
  subscribing.value = true
  
  try {
    // Here you would typically call an API to subscribe the user
    console.log('Subscribing email:', email.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    alert('Successfully subscribed!')
    email.value = ''
  } catch (error) {
    console.error('Subscription error:', error)
    alert('Failed to subscribe. Please try again.')
  } finally {
    subscribing.value = false
  }
}
</script>