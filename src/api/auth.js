import { PublicApiService, PrivateApiService } from './base'
import { API_ENDPOINTS } from '@/config'

class AuthApiService extends PublicApiService {
  constructor() {
    super('')
  }
  
  // Đăng nhập
  async login(credentials) {
    return this.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  }
  
  // Đăng ký
  async register(userData) {
    return this.post(API_ENDPOINTS.AUTH.REGISTER, userData)
  }
  
  // Refresh token
  async refreshToken(refreshToken) {
    return this.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    })
  }
  
  // Đăng xuất
  async logout() {
    return this.post(API_ENDPOINTS.AUTH.LOGOUT)
  }
  
  // Quên mật khẩu
  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email })
  }
  
  // Reset mật khẩu
  async resetPassword(data) {
    return this.post('/auth/reset-password', data)
  }
  
  // Xác minh email
  async verifyEmail(token) {
    return this.post('/auth/verify-email', { token })
  }
  
  // Gửi lại email xác minh
  async resendVerification(email) {
    return this.post('/auth/resend-verification', { email })
  }
}

class ProfileApiService extends PrivateApiService {
  constructor() {
    super('')
  }
  
  // Lấy thông tin profile
  async getProfile() {
    return this.get(API_ENDPOINTS.AUTH.PROFILE)
  }
  
  // Cập nhật profile
  async updateProfile(data) {
    return this.put(API_ENDPOINTS.AUTH.PROFILE, data)
  }
  
  // Đổi mật khẩu
  async changePassword(data) {
    return this.post('/auth/change-password', data)
  }
  
  // Upload avatar
  async uploadAvatar(file) {
    return this.upload('/auth/avatar', file)
  }
  
  // Xóa avatar
  async deleteAvatar() {
    return this.delete('/auth/avatar')
  }
}

// Export instances
export const authApi = new AuthApiService()
export const profileApi = new ProfileApiService()

export default {
  authApi,
  profileApi,
}