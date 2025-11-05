import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { blogApi, publicBlogApi, categoryApi, tagApi } from '@/api/blog'

export const useBlogStore = defineStore('blog', () => {
  // State
  const blogs = ref([])
  const currentBlog = ref(null)
  const categories = ref([])
  const tags = ref([])
  const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  })
  const filters = ref({
    search: '',
    category_id: null,
    tag_id: null,
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const publishedBlogs = computed(() => 
    blogs.value.filter(blog => blog.status === 'published')
  )
  
  const draftBlogs = computed(() => 
    blogs.value.filter(blog => blog.status === 'draft')
  )
  
  const totalBlogs = computed(() => pagination.value.total)
  
  const hasNextPage = computed(() => 
    pagination.value.current_page < pagination.value.last_page
  )
  
  const hasPrevPage = computed(() => 
    pagination.value.current_page > 1
  )
  
  // Actions
  const setError = (errorMessage) => {
    error.value = errorMessage
  }
  
  const clearError = () => {
    error.value = null
  }
  
  const setLoading = (isLoading) => {
    loading.value = isLoading
  }
  
  // Fetch blogs with pagination and filters
  const fetchBlogs = async (page = 1, isPublicOnly = false) => {
    try {
      setLoading(true)
      clearError()
      
      const apiService = isPublicOnly ? publicBlogApi : blogApi
      const response = await apiService.getBlogs(
        page,
        pagination.value.per_page,
        filters.value.search,
        filters.value.sort_by,
        filters.value.sort_order
      )
      
      if (response.success) {
        blogs.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page,
          per_page: response.data.per_page,
          total: response.data.total,
          last_page: response.data.last_page,
        }
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch blogs'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch single blog
  const fetchBlog = async (id, isPublicOnly = false) => {
    try {
      setLoading(true)
      clearError()
      
      const apiService = isPublicOnly ? publicBlogApi : blogApi
      const response = await apiService.getBlog(id)
      
      if (response.success) {
        currentBlog.value = response.data
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch blog'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Create new blog
  const createBlog = async (blogData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await blogApi.createBlog(blogData)
      
      if (response.success) {
        // Add to beginning of blogs array
        blogs.value.unshift(response.data)
        pagination.value.total += 1
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create blog'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Update blog
  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await blogApi.updateBlog(id, blogData)
      
      if (response.success) {
        // Update in blogs array
        const index = blogs.value.findIndex(blog => blog.id === id)
        if (index !== -1) {
          blogs.value[index] = response.data
        }
        
        // Update current blog if it's the same
        if (currentBlog.value?.id === id) {
          currentBlog.value = response.data
        }
        
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update blog'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Delete blog
  const deleteBlog = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await blogApi.deleteBlog(id)
      
      if (response.success) {
        // Remove from blogs array
        blogs.value = blogs.value.filter(blog => blog.id !== id)
        pagination.value.total -= 1
        
        // Clear current blog if it's the deleted one
        if (currentBlog.value?.id === id) {
          currentBlog.value = null
        }
        
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete blog'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Upload blog image
  const uploadBlogImage = async (id, file) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await blogApi.uploadImage(id, file)
      
      if (response.success) {
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload image'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Search blogs
  const searchBlogs = async (query, searchFilters = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await blogApi.searchBlogs(query, searchFilters)
      
      if (response.success) {
        blogs.value = response.data.data
        pagination.value = {
          current_page: response.data.current_page || 1,
          per_page: response.data.per_page || 10,
          total: response.data.total || 0,
          last_page: response.data.last_page || 1,
        }
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to search blogs'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Toggle blog like
  const toggleLike = async (id) => {
    try {
      const response = await blogApi.toggleLike(id)
      
      if (response.success) {
        // Update like count in blogs array
        const index = blogs.value.findIndex(blog => blog.id === id)
        if (index !== -1) {
          blogs.value[index].likes_count = response.data.likes_count
          blogs.value[index].is_liked = response.data.is_liked
        }
        
        // Update current blog
        if (currentBlog.value?.id === id) {
          currentBlog.value.likes_count = response.data.likes_count
          currentBlog.value.is_liked = response.data.is_liked
        }
        
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to toggle like'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }
  
  // Toggle publish status
  const togglePublish = async (id) => {
    try {
      setLoading(true)
      
      const response = await blogApi.togglePublish(id)
      
      if (response.success) {
        // Update status in blogs array
        const index = blogs.value.findIndex(blog => blog.id === id)
        if (index !== -1) {
          blogs.value[index].status = response.data.status
          blogs.value[index].published_at = response.data.published_at
        }
        
        // Update current blog
        if (currentBlog.value?.id === id) {
          currentBlog.value.status = response.data.status
          currentBlog.value.published_at = response.data.published_at
        }
        
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to toggle publish status'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getCategories()
      
      if (response.success) {
        categories.value = response.data
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch categories'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }
  
  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await tagApi.getTags()
      
      if (response.success) {
        tags.value = response.data
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch tags'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }
  
  // Update filters
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  // Reset filters
  const resetFilters = () => {
    filters.value = {
      search: '',
      category_id: null,
      tag_id: null,
      sort_by: 'created_at',
      sort_order: 'desc',
    }
  }
  
  // Reset state
  const resetState = () => {
    blogs.value = []
    currentBlog.value = null
    pagination.value = {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1,
    }
    resetFilters()
    clearError()
  }
  
  return {
    // State
    blogs,
    currentBlog,
    categories,
    tags,
    pagination,
    filters,
    loading,
    error,
    
    // Getters
    publishedBlogs,
    draftBlogs,
    totalBlogs,
    hasNextPage,
    hasPrevPage,
    
    // Actions
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadBlogImage,
    searchBlogs,
    toggleLike,
    togglePublish,
    fetchCategories,
    fetchTags,
    updateFilters,
    resetFilters,
    resetState,
    setError,
    clearError,
  }
})