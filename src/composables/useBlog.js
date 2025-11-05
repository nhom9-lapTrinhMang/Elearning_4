import { ref, computed, watch } from 'vue'
import { useBlogStore } from '@/store/blog'
import { useRouter } from 'vue-router'

export function useBlog() {
  const blogStore = useBlogStore()
  const router = useRouter()
  
  // Reactive forms
  const blogForm = ref({
    title: '',
    content: '',
    excerpt: '',
    featured_image: null,
    category_id: null,
    tags: [],
    status: 'draft',
    meta_title: '',
    meta_description: '',
    slug: '',
  })
  
  const searchForm = ref({
    query: '',
    category_id: null,
    tag_id: null,
    sort_by: 'created_at',
    sort_order: 'desc',
  })
  
  const validationErrors = ref({})
  const uploadProgress = ref(0)
  
  // Computed
  const isEditing = computed(() => !!blogForm.value.id)
  const canPublish = computed(() => 
    blogForm.value.title && 
    blogForm.value.content && 
    blogForm.value.category_id
  )
  
  // Helper functions
  const clearErrors = () => {
    validationErrors.value = {}
    blogStore.clearError()
  }
  
  const setValidationErrors = (errors) => {
    validationErrors.value = errors || {}
  }
  
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Auto-generate slug from title
  watch(() => blogForm.value.title, (newTitle) => {
    if (newTitle && !isEditing.value) {
      blogForm.value.slug = generateSlug(newTitle)
    }
  })
  
  // Auto-generate meta title from title
  watch(() => blogForm.value.title, (newTitle) => {
    if (newTitle && !blogForm.value.meta_title) {
      blogForm.value.meta_title = newTitle
    }
  })
  
  // Auto-generate meta description from excerpt
  watch(() => blogForm.value.excerpt, (newExcerpt) => {
    if (newExcerpt && !blogForm.value.meta_description) {
      blogForm.value.meta_description = newExcerpt
    }
  })
  
  // Validate blog form
  const validateBlogForm = () => {
    const errors = {}
    
    if (!blogForm.value.title?.trim()) {
      errors.title = ['Title is required']
    }
    
    if (!blogForm.value.content?.trim()) {
      errors.content = ['Content is required']
    }
    
    if (!blogForm.value.category_id) {
      errors.category_id = ['Category is required']
    }
    
    if (!blogForm.value.slug?.trim()) {
      errors.slug = ['Slug is required']
    } else if (!/^[a-z0-9-]+$/.test(blogForm.value.slug)) {
      errors.slug = ['Slug can only contain lowercase letters, numbers, and hyphens']
    }
    
    return errors
  }
  
  // Load blog data into form
  const loadBlogIntoForm = (blog) => {
    blogForm.value = {
      id: blog.id,
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      featured_image: blog.featured_image || null,
      category_id: blog.category_id || null,
      tags: blog.tags?.map(tag => tag.id) || [],
      status: blog.status || 'draft',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      slug: blog.slug || '',
    }
  }
  
  // Reset blog form
  const resetBlogForm = () => {
    blogForm.value = {
      title: '',
      content: '',
      excerpt: '',
      featured_image: null,
      category_id: null,
      tags: [],
      status: 'draft',
      meta_title: '',
      meta_description: '',
      slug: '',
    }
    clearErrors()
  }
  
  // Fetch blogs with current filters
  const fetchBlogs = async (page = 1) => {
    // Update store filters
    blogStore.updateFilters({
      search: searchForm.value.query,
      category_id: searchForm.value.category_id,
      tag_id: searchForm.value.tag_id,
      sort_by: searchForm.value.sort_by,
      sort_order: searchForm.value.sort_order,
    })
    
    return await blogStore.fetchBlogs(page)
  }
  
  // Fetch public blogs
  const fetchPublicBlogs = async (page = 1) => {
    return await blogStore.fetchBlogs(page, true)
  }
  
  // Fetch single blog
  const fetchBlog = async (id, isPublic = false) => {
    const result = await blogStore.fetchBlog(id, isPublic)
    
    if (result.success) {
      loadBlogIntoForm(result.data)
    }
    
    return result
  }
  
  // Create blog
  const createBlog = async (autoSave = false) => {
    clearErrors()
    
    if (!autoSave) {
      const errors = validateBlogForm()
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return { success: false, message: 'Please fix the validation errors' }
      }
    }
    
    try {
      const result = await blogStore.createBlog(blogForm.value)
      
      if (result.success) {
        if (!autoSave) {
          resetBlogForm()
          router.push('/blogs')
        } else {
          // Update form with returned data (like ID)
          blogForm.value.id = result.data.id
        }
      } else {
        if (result.errors) {
          setValidationErrors(result.errors)
        }
      }
      
      return result
    } catch (error) {
      console.error('Create blog error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Update blog
  const updateBlog = async (autoSave = false) => {
    clearErrors()
    
    if (!blogForm.value.id) {
      return { success: false, message: 'Blog ID is required for update' }
    }
    
    if (!autoSave) {
      const errors = validateBlogForm()
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return { success: false, message: 'Please fix the validation errors' }
      }
    }
    
    try {
      const result = await blogStore.updateBlog(blogForm.value.id, blogForm.value)
      
      if (result.success) {
        if (!autoSave) {
          router.push('/blogs')
        }
      } else {
        if (result.errors) {
          setValidationErrors(result.errors)
        }
      }
      
      return result
    } catch (error) {
      console.error('Update blog error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Save blog (create or update)
  const saveBlog = async (autoSave = false) => {
    if (isEditing.value) {
      return await updateBlog(autoSave)
    } else {
      return await createBlog(autoSave)
    }
  }
  
  // Delete blog
  const deleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return { success: false, message: 'Cancelled' }
    }
    
    try {
      const result = await blogStore.deleteBlog(id)
      
      if (result.success) {
        // Redirect if we're currently viewing the deleted blog
        if (router.currentRoute.value.params.id == id) {
          router.push('/blogs')
        }
      }
      
      return result
    } catch (error) {
      console.error('Delete blog error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Upload featured image
  const uploadFeaturedImage = async (file) => {
    if (!file) {
      return { success: false, message: 'Please select a file' }
    }
    
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: 'Invalid file type. Please upload an image.' }
    }
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, message: 'File size too large. Maximum 5MB allowed.' }
    }
    
    try {
      uploadProgress.value = 0
      
      let blogId = blogForm.value.id
      
      // If no ID, save as draft first
      if (!blogId) {
        const saveResult = await saveBlog(true)
        if (!saveResult.success) {
          return saveResult
        }
        blogId = blogForm.value.id
      }
      
      const result = await blogStore.uploadBlogImage(blogId, file)
      
      if (result.success) {
        blogForm.value.featured_image = result.data.url
        uploadProgress.value = 100
      }
      
      return result
    } catch (error) {
      console.error('Upload image error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Search blogs
  const searchBlogs = async () => {
    clearErrors()
    
    try {
      const filters = {
        category_id: searchForm.value.category_id,
        tag_id: searchForm.value.tag_id,
        sort_by: searchForm.value.sort_by,
        sort_order: searchForm.value.sort_order,
      }
      
      return await blogStore.searchBlogs(searchForm.value.query, filters)
    } catch (error) {
      console.error('Search blogs error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Toggle like
  const toggleLike = async (id) => {
    try {
      return await blogStore.toggleLike(id)
    } catch (error) {
      console.error('Toggle like error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Toggle publish status
  const togglePublish = async (id) => {
    try {
      const result = await blogStore.togglePublish(id)
      
      if (result.success) {
        // Update form if we're editing this blog
        if (blogForm.value.id === id) {
          blogForm.value.status = result.data.status
        }
      }
      
      return result
    } catch (error) {
      console.error('Toggle publish error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Auto-save functionality
  const setupAutoSave = (intervalMs = 30000) => {
    let autoSaveTimer
    
    const autoSave = async () => {
      if (blogForm.value.title || blogForm.value.content) {
        await saveBlog(true) // Auto-save
      }
    }
    
    const startAutoSave = () => {
      stopAutoSave()
      autoSaveTimer = setInterval(autoSave, intervalMs)
    }
    
    const stopAutoSave = () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer)
        autoSaveTimer = null
      }
    }
    
    // Watch for changes to start auto-save
    watch([() => blogForm.value.title, () => blogForm.value.content], () => {
      startAutoSave()
    })
    
    return { startAutoSave, stopAutoSave, autoSave }
  }
  
  // Initialize
  const initializeBlogData = async () => {
    await Promise.all([
      blogStore.fetchCategories(),
      blogStore.fetchTags(),
    ])
  }
  
  return {
    // Forms
    blogForm,
    searchForm,
    validationErrors,
    uploadProgress,
    
    // Computed
    isEditing,
    canPublish,
    
    // Store state
    blogs: blogStore.blogs,
    currentBlog: blogStore.currentBlog,
    categories: blogStore.categories,
    tags: blogStore.tags,
    pagination: blogStore.pagination,
    loading: blogStore.loading,
    error: blogStore.error,
    publishedBlogs: blogStore.publishedBlogs,
    draftBlogs: blogStore.draftBlogs,
    
    // Functions
    fetchBlogs,
    fetchPublicBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    saveBlog,
    deleteBlog,
    uploadFeaturedImage,
    searchBlogs,
    toggleLike,
    togglePublish,
    loadBlogIntoForm,
    resetBlogForm,
    setupAutoSave,
    initializeBlogData,
    clearErrors,
    
    // Utilities
    generateSlug,
  }
}