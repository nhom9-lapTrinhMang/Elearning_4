<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Welcome to</span>
                <span class="block text-primary-600 xl:inline">{{ appName }}</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {{ appDescription }}
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <router-link
                    to="/blogs"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Explore Blogs
                  </router-link>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <router-link
                    to="/about"
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Learn More
                  </router-link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Hero image"
        />
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to get started
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Built with modern technologies and best practices for scalable web applications.
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div v-for="feature in features" :key="feature.name" class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <component :is="feature.icon" class="h-6 w-6" />
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.name }}</p>
              <p class="mt-2 ml-16 text-base text-gray-500">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Blogs Section -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">Latest Blog Posts</h2>
          <p class="mt-4 text-lg text-gray-500">
            Stay updated with our latest articles and insights.
          </p>
        </div>

        <div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="blog in latestBlogs"
            :key="blog.id"
            hoverable
            clickable
            padding="none"
            @click="() => $router.push(`/blogs/${blog.slug}`)"
          >
            <div class="aspect-w-16 aspect-h-9">
              <img
                :src="blog.featured_image || 'https://via.placeholder.com/400x225'"
                :alt="blog.title"
                class="w-full h-48 object-cover"
              />
            </div>
            <div class="p-6">
              <p class="text-sm font-medium text-primary-600">
                {{ blog.category?.name }}
              </p>
              <h3 class="mt-2 text-xl font-semibold text-gray-900">
                {{ blog.title }}
              </h3>
              <p class="mt-3 text-base text-gray-500">
                {{ blog.excerpt }}
              </p>
              <div class="mt-6 flex items-center">
                <div class="flex-shrink-0">
                  <img
                    v-if="blog.author?.avatar"
                    :src="blog.author.avatar"
                    :alt="blog.author.name"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm"
                  >
                    {{ blog.author?.name?.charAt(0)?.toUpperCase() }}
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ blog.author?.name }}
                  </p>
                  <div class="flex space-x-1 text-sm text-gray-500">
                    <time :datetime="blog.published_at">
                      {{ formatDate(blog.published_at) }}
                    </time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{{ blog.read_time }} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div class="mt-12 text-center">
          <router-link
            to="/blogs"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
          >
            View All Posts
            <svg class="ml-2 -mr-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block">Join our community today.</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-primary-200">
          Sign up now and start sharing your thoughts with the world.
        </p>
        <div class="mt-8 flex justify-center space-x-4">
          <router-link
            to="/register"
            class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition-colors duration-200"
          >
            Get Started
          </router-link>
          <router-link
            to="/login"
            class="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-600 transition-colors duration-200"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '@/components/ui/Card.vue'
import { publicBlogApi } from '@/api/blog'
import { APP_CONFIG } from '@/config'

const appName = APP_CONFIG.name
const appDescription = APP_CONFIG.description || 'A modern Vue 3 application for blogging and content management.'

const latestBlogs = ref([])
const loading = ref(false)

const features = [
  {
    name: 'Modern Technology Stack',
    description: 'Built with Vue 3, Vite, and TailwindCSS for optimal performance.',
    icon: 'svg' // Replace with actual icon
  },
  {
    name: 'Responsive Design',
    description: 'Works perfectly on desktop, tablet, and mobile devices.',
    icon: 'svg' // Replace with actual icon
  },
  {
    name: 'Authentication System',
    description: 'Secure user authentication with JWT tokens and role-based access.',
    icon: 'svg' // Replace with actual icon
  },
  {
    name: 'Content Management',
    description: 'Full-featured blog management with categories, tags, and media upload.',
    icon: 'svg' // Replace with actual icon
  }
]

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchLatestBlogs = async () => {
  try {
    loading.value = true
    const response = await publicBlogApi.getPublicBlogs(1, 3)
    
    if (response.success) {
      latestBlogs.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to fetch latest blogs:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLatestBlogs()
})
</script>