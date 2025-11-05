<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Welcome back, {{ user?.name }}! Here's what's happening.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <router-link
          to="/admin/blogs/create"
          class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          New Post
        </router-link>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        v-for="stat in stats"
        :key="stat.name"
        padding="md"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="stat.icon"
              class="h-8 w-8 text-primary-600"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ stat.name }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ stat.value }}
                </div>
                <div
                  v-if="stat.change"
                  :class="[
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  ]"
                >
                  <svg
                    v-if="stat.changeType === 'increase'"
                    class="self-center flex-shrink-0 h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    class="self-center flex-shrink-0 h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ stat.change }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </Card>
    </div>

    <!-- Recent activities and quick actions -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent posts -->
      <Card
        title="Recent Posts"
        show-header
        padding="md"
      >
        <div class="flow-root">
          <ul class="-my-5 divide-y divide-gray-200">
            <li
              v-for="post in recentPosts"
              :key="post.id"
              class="py-4"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="post.featured_image"
                    :src="post.featured_image"
                    :alt="post.title"
                    class="h-8 w-8 rounded object-cover"
                  />
                  <div
                    v-else
                    class="h-8 w-8 rounded bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ post.title }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(post.created_at) }}
                  </p>
                </div>
                <div>
                  <span
                    :class="[
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                    ]"
                  >
                    {{ post.status }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <template #footer>
          <router-link
            to="/admin/blogs"
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all posts →
          </router-link>
        </template>
      </Card>

      <!-- Quick actions -->
      <Card
        title="Quick Actions"
        show-header
        padding="md"
      >
        <div class="grid grid-cols-2 gap-4">
          <router-link
            to="/admin/blogs/create"
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-primary-50 text-primary-600 ring-4 ring-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </div>
            <div class="mt-8">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                New Post
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Create a new blog post
              </p>
            </div>
          </router-link>

          <router-link
            to="/admin/categories"
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <div class="mt-8">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Categories
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Manage categories
              </p>
            </div>
          </router-link>

          <router-link
            to="/admin/users"
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </span>
            </div>
            <div class="mt-8">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Users
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Manage users
              </p>
            </div>
          </router-link>

          <router-link
            to="/profile"
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
            <div class="mt-8">
              <h3 class="text-lg font-medium">
                <span class="absolute inset-0" aria-hidden="true"></span>
                Profile
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Edit your profile
              </p>
            </div>
          </router-link>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '@/components/ui/Card.vue'
import { useAuth } from '@/composables/useAuth'
import { useBlog } from '@/composables/useBlog'

const { user } = useAuth()
const { fetchBlogs } = useBlog()

const stats = ref([
  {
    name: 'Total Posts',
    value: '0',
    icon: 'svg', // Replace with actual icon
    change: '+4.75%',
    changeType: 'increase'
  },
  {
    name: 'Published',
    value: '0',
    icon: 'svg', // Replace with actual icon
    change: '+54.02%',
    changeType: 'increase'
  },
  {
    name: 'Drafts',
    value: '0',
    icon: 'svg', // Replace with actual icon
    change: '-1.39%',
    changeType: 'decrease'
  },
  {
    name: 'Total Views',
    value: '0',
    icon: 'svg', // Replace with actual icon
    change: '+10.18%',
    changeType: 'increase'
  }
])

const recentPosts = ref([])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const loadDashboardData = async () => {
  try {
    // Load recent posts
    const result = await fetchBlogs(1)
    if (result.success) {
      recentPosts.value = result.data.data.slice(0, 5)
    }
    
    // Update stats (you would get these from an API)
    // stats.value[0].value = result.data.total.toString()
    // ... update other stats
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>