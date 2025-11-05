<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="flex items-center space-x-2"
          >
            <img
              v-if="logo"
              :src="logo"
              :alt="appName"
              class="h-8 w-auto"
            />
            <span class="text-xl font-bold text-gray-900">
              {{ appName }}
            </span>
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="[
              'text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200',
              isActiveRoute(item.href) ? 'text-primary-600 border-b-2 border-primary-600' : ''
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- User menu -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Notifications -->
          <button
            v-if="isAuthenticated"
            type="button"
            class="p-2 text-gray-400 hover:text-gray-500 relative"
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-5 5v-5zM10.59 14.41l5-5-1.41-1.41-5 5z"
              />
            </svg>
            <span
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ notificationCount > 9 ? '9+' : notificationCount }}
            </span>
          </button>

          <!-- User dropdown -->
          <div
            v-if="isAuthenticated"
            class="relative"
          >
            <button
              type="button"
              class="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
              @click="showUserMenu = !showUserMenu"
            >
              <img
                v-if="user?.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="h-8 w-8 rounded-full object-cover"
              />
              <div
                v-else
                class="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium"
              >
                {{ user?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <span class="hidden lg:block">{{ user?.name }}</span>
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                @click="showUserMenu = false"
              >
                <router-link
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.href"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {{ item.name }}
                </router-link>
                
                <hr class="my-1" />
                
                <button
                  type="button"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="handleLogout"
                >
                  Sign out
                </button>
              </div>
            </transition>
          </div>

          <!-- Auth buttons -->
          <div
            v-else
            class="flex items-center space-x-3"
          >
            <router-link
              to="/login"
              class="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Sign up
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            type="button"
            class="text-gray-600 hover:text-gray-900 focus:outline-none"
            @click="showMobileMenu = !showMobileMenu"
          >
            <svg
              v-if="!showMobileMenu"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showMobileMenu"
        class="md:hidden bg-white border-t border-gray-200"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="[
              'block px-3 py-2 text-base font-medium transition-colors duration-200',
              isActiveRoute(item.href)
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
            @click="showMobileMenu = false"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Mobile user section -->
        <div
          v-if="isAuthenticated"
          class="pt-4 pb-3 border-t border-gray-200"
        >
          <div class="flex items-center px-5">
            <img
              v-if="user?.avatar"
              :src="user.avatar"
              :alt="user.name"
              class="h-10 w-10 rounded-full object-cover"
            />
            <div
              v-else
              class="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium"
            >
              {{ user?.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user?.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
            </div>
          </div>
          
          <div class="mt-3 px-2 space-y-1">
            <router-link
              v-for="item in userMenuItems"
              :key="item.name"
              :to="item.href"
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              @click="showMobileMenu = false"
            >
              {{ item.name }}
            </router-link>
            
            <button
              type="button"
              class="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              @click="handleLogout"
            >
              Sign out
            </button>
          </div>
        </div>

        <!-- Mobile auth buttons -->
        <div
          v-else
          class="pt-4 pb-3 border-t border-gray-200"
        >
          <div class="px-2 space-y-1">
            <router-link
              to="/login"
              class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              @click="showMobileMenu = false"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50"
              @click="showMobileMenu = false"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { APP_CONFIG } from '@/config'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const notificationCount = ref(0)

const appName = APP_CONFIG.name
const logo = '/logo.png' // Add your logo path

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]

const userMenuItems = computed(() => {
  const items = [
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' }
  ]
  
  if (isAuthenticated.value) {
    items.push({ name: 'Dashboard', href: '/dashboard' })
  }
  
  return items
})

const isActiveRoute = (href) => {
  if (href === '/') {
    return route.path === href
  }
  return route.path.startsWith(href)
}

const handleLogout = async () => {
  showUserMenu.value = false
  showMobileMenu.value = false
  await logout()
}

// Close menus when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>