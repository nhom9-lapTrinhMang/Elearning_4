import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, profileApi } from '@/api/auth'
import { AUTH_CONFIG } from '@/config'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem(AUTH_CONFIG.tokenStorageKey))
  const refreshToken = ref(localStorage.getItem(AUTH_CONFIG.refreshTokenKey))
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => ['admin', 'moderator'].includes(user.value?.role))
  const userPermissions = computed(() => user.value?.permissions || [])
  
  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(AUTH_CONFIG.tokenStorageKey, newToken)
    } else {
      localStorage.removeItem(AUTH_CONFIG.tokenStorageKey)
    }
  }
  
  const setRefreshToken = (newRefreshToken) => {
    refreshToken.value = newRefreshToken
    if (newRefreshToken) {
      localStorage.setItem(AUTH_CONFIG.refreshTokenKey, newRefreshToken)
    } else {
      localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
    }
  }
  
  const setUser = (userData) => {
    user.value = userData
  }
  
  const setError = (errorMessage) => {
    error.value = errorMessage
  }
  
  const clearError = () => {
    error.value = null
  }
  
  // Login
  const login = async (credentials) => {
    try {
      loading.value = true
      clearError()
      
      const response = await authApi.login(credentials)
      
      if (response.success) {
        const { user: userData, access_token, refresh_token } = response.data
        
        setUser(userData)
        setToken(access_token)
        setRefreshToken(refresh_token)
        
        return { success: true, data: userData }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  // Register
  const register = async (userData) => {
    try {
      loading.value = true
      clearError()
      
      const response = await authApi.register(userData)
      
      if (response.success) {
        return { success: true, message: response.message }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  // Logout
  const logout = async () => {
    try {
      loading.value = true
      
      // Gọi API logout nếu có token
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local data
      setUser(null)
      setToken(null)
      setRefreshToken(null)
      clearError()
      loading.value = false
    }
  }
  
  // Get current user profile
  const fetchProfile = async () => {
    try {
      loading.value = true
      
      const response = await profileApi.getProfile()
      
      if (response.success) {
        setUser(response.data)
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  // Update profile
  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      clearError()
      
      const response = await profileApi.updateProfile(profileData)
      
      if (response.success) {
        setUser(response.data)
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  // Change password
  const changePassword = async (passwordData) => {
    try {
      loading.value = true
      clearError()
      
      const response = await profileApi.changePassword(passwordData)
      
      if (response.success) {
        return { success: true, message: response.message }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      loading.value = true
      clearError()
      
      const response = await profileApi.uploadAvatar(file)
      
      if (response.success) {
        // Update user avatar
        setUser({ ...user.value, avatar: response.data.avatar })
        return { success: true, data: response.data }
      } else {
        setError(response.message)
        return { success: false, message: response.message }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to upload avatar'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  // Check if user has permission
  const hasPermission = (permission) => {
    return userPermissions.value.includes(permission)
  }
  
  // Check if user has any of the permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => userPermissions.value.includes(permission))
  }
  
  // Check if user has all permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => userPermissions.value.includes(permission))
  }
  
  // Initialize auth state
  const initAuth = async () => {
    if (token.value && !user.value) {
      await fetchProfile()
    }
  }
  
  return {
    // State
    user,
    token,
    refreshToken,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isModerator,
    userPermissions,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    initAuth,
    setError,
    clearError,
  }
})