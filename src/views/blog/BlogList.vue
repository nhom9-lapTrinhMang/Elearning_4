<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Blogs</h1>
        <p class="text-gray-600 mt-1">Manage your blog posts</p>
      </div>
      <router-link
        to="/blogs/create"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-200"
      >
        Create New Blog
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search blogs..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
          <svg
            class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div class="flex gap-2">
        <select
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="created_at">Latest</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>
        
        <select
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="mt-2 text-gray-600">Loading blogs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading blogs</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="fetchBlogs"
        class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredBlogs.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No blogs found</h3>
      <p class="mt-2 text-gray-600">Get started by creating your first blog post.</p>
      <router-link
        to="/blogs/create"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
      >
        Create New Blog
      </router-link>
    </div>

    <!-- Blog List -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="blog in filteredBlogs"
        :key="blog.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Blog Image -->
        <div class="aspect-w-16 aspect-h-9">
          <img
            :src="blog.featured_image || '/images/placeholder-blog.jpg'"
            :alt="blog.title"
            class="w-full h-48 object-cover rounded-t-lg"
          >
        </div>
        
        <!-- Blog Content -->
        <div class="p-6">
          <!-- Status Badge -->
          <div class="mb-3">
            <span
              :class="{
                'bg-green-100 text-green-800': blog.status === 'published',
                'bg-yellow-100 text-yellow-800': blog.status === 'draft'
              }"
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
            >
              {{ blog.status }}
            </span>
          </div>
          
          <!-- Title -->
          <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {{ blog.title }}
          </h3>
          
          <!-- Excerpt -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {{ blog.excerpt || blog.content?.substring(0, 150) + '...' }}
          </p>
          
          <!-- Meta Info -->
          <div class="text-xs text-gray-500 mb-4">
            <p>Created: {{ formatDate(blog.created_at) }}</p>
            <p v-if="blog.updated_at !== blog.created_at">
              Updated: {{ formatDate(blog.updated_at) }}
            </p>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-between items-center">
            <router-link
              :to="`/blogs/${blog.id}`"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Details
            </router-link>
            
            <div class="flex space-x-2">
              <router-link
                :to="`/blogs/${blog.id}/edit`"
                class="text-blue-600 hover:text-blue-700"
                title="Edit"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </router-link>
              
              <button
                @click="deleteBlog(blog.id)"
                class="text-red-600 hover:text-red-700"
                title="Delete"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.per_page" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page <= 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span class="px-3 py-2 text-sm text-gray-700">
          Page {{ pagination.current_page }} of {{ Math.ceil(pagination.total / pagination.per_page) }}
        </span>
        
        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page >= Math.ceil(pagination.total / pagination.per_page)"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useBlog } from '@/composables/useBlog'

const { blogs, loading, error, fetchBlogs, deleteBlog: removeBlog } = useBlog()

// State
const searchQuery = ref('')
const sortBy = ref('created_at')
const filterStatus = ref('')
const pagination = ref({
  current_page: 1,
  per_page: 9,
  total: 0
})

// Computed
const filteredBlogs = computed(() => {
  let filtered = blogs.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(blog => blog.status === filterStatus.value)
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortBy.value === 'title') {
      return a.title.localeCompare(b.title)
    } else if (sortBy.value === 'status') {
      return a.status.localeCompare(b.status)
    } else {
      return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  return filtered
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const deleteBlog = async (blogId) => {
  if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
    await removeBlog(blogId)
  }
}

const changePage = (page) => {
  pagination.value.current_page = page
  fetchBlogs({ page, per_page: pagination.value.per_page })
}

// Watch for search changes
watch([searchQuery, sortBy, filterStatus], () => {
  pagination.value.current_page = 1
})

// Lifecycle
onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>