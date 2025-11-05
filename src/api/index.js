// Export tất cả API services
export { default as axiosInstance } from './axiosInstance'
export { default as BaseApiService, PublicApiService, PrivateApiService } from './base'
export { ApiResponse, ApiRequest, PaginationRequest, UploadRequest, ApiError } from './types'

// Auth APIs
export { authApi, profileApi } from './auth'

// Blog APIs
export { blogApi, publicBlogApi, categoryApi, tagApi } from './blog'

// User APIs
export { userApi } from './user'

// Default export với tất cả APIs
export default {
  auth: () => import('./auth'),
  blog: () => import('./blog'),
  user: () => import('./user'),
}