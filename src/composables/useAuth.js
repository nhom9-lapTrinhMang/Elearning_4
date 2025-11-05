import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  // Reactive state
  const loginForm = ref({
    email: '',
    password: '',
    remember: false,
  })
  
  const registerForm = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  })
  
  const profileForm = ref({
    name: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
  })
  
  const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  
  const validationErrors = ref({})
  
  // Helper functions
  const clearErrors = () => {
    validationErrors.value = {}
    authStore.clearError()
  }
  
  const setValidationErrors = (errors) => {
    validationErrors.value = errors || {}
  }
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }
  
  const validatePassword = (password) => {
    return password.length >= 8
  }
  
  // Login function
  const login = async (credentials = null) => {
    clearErrors()
    
    const loginData = credentials || loginForm.value
    
    // Client-side validation
    if (!loginData.email) {
      setValidationErrors({ email: ['Email is required'] })
      return { success: false, message: 'Email is required' }
    }
    
    if (!validateEmail(loginData.email)) {
      setValidationErrors({ email: ['Invalid email format'] })
      return { success: false, message: 'Invalid email format' }
    }
    
    if (!loginData.password) {
      setValidationErrors({ password: ['Password is required'] })
      return { success: false, message: 'Password is required' }
    }
    
    try {
      const result = await authStore.login(loginData)
      
      if (result.success) {
        // Reset form
        loginForm.value = {
          email: '',
          password: '',
          remember: false,
        }
        
        // Redirect to intended page or dashboard
        const redirectTo = router.currentRoute.value.query.redirect || '/dashboard'
        router.push(redirectTo)
      } else {
        // Handle API validation errors
        if (result.errors) {
          setValidationErrors(result.errors)
        }
      }
      
      return result
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Register function
  const register = async (userData = null) => {
    clearErrors()
    
    const registrationData = userData || registerForm.value
    
    // Client-side validation
    const errors = {}
    
    if (!registrationData.name) {
      errors.name = ['Name is required']
    }
    
    if (!registrationData.email) {
      errors.email = ['Email is required']
    } else if (!validateEmail(registrationData.email)) {
      errors.email = ['Invalid email format']
    }
    
    if (!registrationData.password) {
      errors.password = ['Password is required']
    } else if (!validatePassword(registrationData.password)) {
      errors.password = ['Password must be at least 8 characters']
    }
    
    if (registrationData.password !== registrationData.password_confirmation) {
      errors.password_confirmation = ['Passwords do not match']
    }
    
    if (!registrationData.terms) {
      errors.terms = ['You must accept the terms and conditions']
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return { success: false, message: 'Please fix the validation errors' }
    }
    
    try {
      const result = await authStore.register(registrationData)
      
      if (result.success) {
        // Reset form
        registerForm.value = {
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          terms: false,
        }
        
        // Redirect to login or verification page
        router.push('/login?message=Registration successful. Please log in.')
      } else {
        // Handle API validation errors
        if (result.errors) {
          setValidationErrors(result.errors)
        }
      }
      
      return result
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Logout function
  const logout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      authStore.logout()
      router.push('/login')
    }
  }
  
  // Update profile function
  const updateProfile = async (profileData = null) => {
    clearErrors()
    
    const updateData = profileData || profileForm.value
    
    // Client-side validation
    const errors = {}
    
    if (!updateData.name) {
      errors.name = ['Name is required']
    }
    
    if (!updateData.email) {
      errors.email = ['Email is required']
    } else if (!validateEmail(updateData.email)) {
      errors.email = ['Invalid email format']
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return { success: false, message: 'Please fix the validation errors' }
    }
    
    try {
      const result = await authStore.updateProfile(updateData)
      
      if (result.success) {
        // Update form with new data
        profileForm.value = { ...result.data }
      } else {
        // Handle API validation errors
        if (result.errors) {
          setValidationErrors(result.errors)
        }
      }
      
      return result
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Change password function
  const changePassword = async (passwordData = null) => {
    clearErrors()
    
    const changeData = passwordData || passwordForm.value
    
    // Client-side validation
    const errors = {}
    
    if (!changeData.current_password) {
      errors.current_password = ['Current password is required']
    }
    
    if (!changeData.password) {
      errors.password = ['New password is required']
    } else if (!validatePassword(changeData.password)) {
      errors.password = ['Password must be at least 8 characters']
    }
    
    if (changeData.password !== changeData.password_confirmation) {
      errors.password_confirmation = ['Passwords do not match']
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return { success: false, message: 'Please fix the validation errors' }
    }
    
    try {
      const result = await authStore.changePassword(changeData)
      
      if (result.success) {
        // Reset form
        passwordForm.value = {
          current_password: '',
          password: '',
          password_confirmation: '',
        }
      } else {
        // Handle API validation errors
        if (result.errors) {
          setValidationErrors(result.errors)
        }
      }
      
      return result
    } catch (error) {
      console.error('Password change error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Upload avatar function
  const uploadAvatar = async (file) => {
    clearErrors()
    
    if (!file) {
      return { success: false, message: 'Please select a file' }
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, message: 'Invalid file type. Please upload an image.' }
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, message: 'File size too large. Maximum 5MB allowed.' }
    }
    
    try {
      const result = await authStore.uploadAvatar(file)
      return result
    } catch (error) {
      console.error('Avatar upload error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    }
  }
  
  // Initialize profile form with user data
  const initProfileForm = () => {
    if (authStore.user) {
      profileForm.value = {
        name: authStore.user.name || '',
        email: authStore.user.email || '',
        phone: authStore.user.phone || '',
        bio: authStore.user.bio || '',
        website: authStore.user.website || '',
      }
    }
  }
  
  // Check authentication and redirect if needed
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
      return false
    }
    return true
  }
  
  // Check if user is guest (not authenticated)
  const requireGuest = () => {
    if (authStore.isAuthenticated) {
      router.push('/dashboard')
      return false
    }
    return true
  }
  
  return {
    // Forms
    loginForm,
    registerForm,
    profileForm,
    passwordForm,
    validationErrors,
    
    // Auth store state
    user: authStore.user,
    loading: authStore.loading,
    error: authStore.error,
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    isModerator: authStore.isModerator,
    
    // Functions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadAvatar,
    initProfileForm,
    requireAuth,
    requireGuest,
    clearErrors,
    
    // Permissions
    hasPermission: authStore.hasPermission,
    hasAnyPermission: authStore.hasAnyPermission,
    hasAllPermissions: authStore.hasAllPermissions,
  }
}