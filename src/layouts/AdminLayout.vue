<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0" :class="{ '-translate-x-full': !sidebarOpen }">
      <div class="flex items-center justify-center h-16 px-4 bg-primary-600">
        <router-link to="/" class="flex items-center space-x-2">
          <img v-if="logo" :src="logo" :alt="appName" class="h-8 w-auto" />
          <span class="text-xl font-bold text-white">{{ appName }}</span>
        </router-link>
      </div>
      
      <nav class="mt-5 px-2">
        <div class="space-y-1">
          <router-link
            v-for="item in sidebarItems"
            :key="item.name"
            :to="item.href"
            :class="[
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              isActiveRoute(item.href)
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <component
              :is="item.icon"
              :class="[
                'mr-3 h-5 w-5 transition-colors duration-200',
                isActiveRoute(item.href)
                  ? 'text-primary-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              ]"
            />
            {{ item.name }}
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Main content area -->
    <div class="flex-1 lg:pl-64">
      <!-- Top bar -->
      <div class="bg-white shadow-sm border-b border-gray-200 lg:hidden">
        <div class="flex items-center justify-between px-4 h-16">
          <button
            type="button"
            class="text-gray-600 hover:text-gray-900 focus:outline-none"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- User menu -->
          <div class="relative">
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
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </router-link>
                <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
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
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <!-- Page header -->
            <div v-if="$slots.header" class="mb-6">
              <slot name="header"></slot>
            </div>
            
            <!-- Page content -->
            <slot></slot>
          </div>
        </div>
      </main>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { APP_CONFIG } from '@/config'

const route = useRoute()
const { user, logout } = useAuth()

const sidebarOpen = ref(false)
const showUserMenu = ref(false)

const appName = APP_CONFIG.name
const logo = '/logo.png'

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'Blogs',
    href: '/admin/blogs',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'Tags',
    href: '/admin/tags',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: 'svg' // Replace with actual icon component
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: 'svg' // Replace with actual icon component
  }
]

const isActiveRoute = (href) => {
  if (href === '/dashboard') {
    return route.path === href
  }
  return route.path.startsWith(href)
}

const handleLogout = async () => {
  showUserMenu.value = false
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