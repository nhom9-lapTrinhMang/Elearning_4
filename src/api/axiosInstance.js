import axios from 'axios'
import { APP_CONFIG, AUTH_CONFIG, HTTP_STATUS } from '@/config'

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor - Thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.tokenStorageKey)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request trong development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Xử lý response và error
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response trong development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log error trong development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      })
    }
    
    // Xử lý token hết hạn
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem(AUTH_CONFIG.refreshTokenKey)
        if (refreshToken) {
          // Gọi API refresh token
          const response = await axios.post(
            `${APP_CONFIG.apiBaseUrl}/auth/refresh`,
            { refresh_token: refreshToken }
          )
          
          const { access_token } = response.data.data
          localStorage.setItem(AUTH_CONFIG.tokenStorageKey, access_token)
          
          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token cũng hết hạn, đăng xuất user
        localStorage.removeItem(AUTH_CONFIG.tokenStorageKey)
        localStorage.removeItem(AUTH_CONFIG.refreshTokenKey)
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance