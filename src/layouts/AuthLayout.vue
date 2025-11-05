<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <router-link to="/" class="flex items-center space-x-2">
          <img v-if="logo" :src="logo" :alt="appName" class="h-10 w-auto" />
          <span class="text-2xl font-bold text-gray-900">{{ appName }}</span>
        </router-link>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <slot></slot>
      </div>
      
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">
              <slot name="divider">New to {{ appName }}?</slot>
            </span>
          </div>
        </div>

        <div class="mt-6 text-center">
          <slot name="footer">
            <p class="text-sm text-gray-600">
              Need help? 
              <router-link to="/contact" class="font-medium text-primary-600 hover:text-primary-500">
                Contact support
              </router-link>
            </p>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_CONFIG } from '@/config'

const appName = APP_CONFIG.name
const logo = '/logo.png'
</script>