<template>
  <div v-if="loading" class="container mx-auto px-4 py-8">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">Loading blog...</p>
    </div>
  </div>

  <div v-else-if="error" class="container mx-auto px-4 py-8">
    <div class="text-center">
      <div class="text-red-500 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading blog</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="fetchBlog"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
      >
        Try Again
      </button>
    </div>
  </div>

  <div v-else-if="blog" class="container mx-auto px-4 py-8">
    <!-- Header with Back Button -->
    <div class="mb-8">
      <button
        @click="goBack"
        class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Blogs
      </button>
    </div>

    <!-- Blog Header -->
    <div class="max-w-4xl mx-auto">
      <!-- Status Badge -->
      <div class="mb-4">
        <span
          :class="{
            'bg-green-100 text-green-800': blog.status === 'published',
            'bg-yellow-100 text-yellow-800': blog.status === 'draft'
          }"
          class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
        >
          {{ blog.status }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ blog.title }}
      </h1>

      <!-- Meta Information -->
      <div class="flex flex-wrap items-center text-gray-600 text-sm mb-6 space-x-4">
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          By {{ blog.author?.name || 'Unknown Author' }}
        </div>
        
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {{ formatDate(blog.created_at) }}
        </div>

        <div v-if="blog.updated_at !== blog.created_at" class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Updated {{ formatDate(blog.updated_at) }}
        </div>

        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          {{ blog.views || 0 }} views
        </div>
      </div>

      <!-- Action Buttons (for owner/admin) -->
      <div v-if="canEdit" class="mb-8">
        <div class="flex space-x-3">
          <router-link
            :to="`/blogs/${blog.id}/edit`"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Blog
          </router-link>
          
          <button
            @click="deleteBlog"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete Blog
          </button>
        </div>
      </div>

      <!-- Featured Image -->
      <div v-if="blog.featured_image" class="mb-8">
        <img
          :src="blog.featured_image"
          :alt="blog.title"
          class="w-full max-h-96 object-cover rounded-lg shadow-lg"
        >
      </div>

      <!-- Excerpt -->
      <div v-if="blog.excerpt" class="mb-8">
        <div class="bg-gray-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
          <p class="text-lg text-gray-700 italic">{{ blog.excerpt }}</p>
        </div>
      </div>

      <!-- Content -->
      <div class="prose prose-lg max-w-none mb-12">
        <div v-html="blog.content"></div>
      </div>

      <!-- Tags -->
      <div v-if="blog.tags && blog.tags.length > 0" class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in blog.tags"
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Share Section -->
      <div class="border-t border-gray-200 pt-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
        <div class="flex space-x-4">
          <button
            @click="shareOnTwitter"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
            Twitter
          </button>
          
          <button
            @click="shareOnFacebook"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
            </svg>
            Facebook
          </button>
          
          <button
            @click="copyLink"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlog } from '@/composables/useBlog'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { blog, loading, error, fetchBlog: getBlog, deleteBlog: removeBlog } = useBlog()
const { user } = useAuth()

const blogId = ref(route.params.id)

// Computed
const canEdit = computed(() => {
  if (!user.value || !blog.value) return false
  return user.value.id === blog.value.author_id || user.value.role === 'admin'
})

// Methods
const fetchBlog = async () => {
  await getBlog(blogId.value)
}

const goBack = () => {
  router.go(-1)
}

const deleteBlog = async () => {
  if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
    const success = await removeBlog(blog.value.id)
    if (success) {
      router.push('/blogs')
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(blog.value.title)
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
}

const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
    alert('Failed to copy link')
  }
}

// Lifecycle
onMounted(() => {
  fetchBlog()
})
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose h1 {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #111827;
}

.prose h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #111827;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #6b7280;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.prose img {
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>