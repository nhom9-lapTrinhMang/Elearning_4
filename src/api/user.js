import { PrivateApiService } from './base'
import { API_ENDPOINTS } from '@/config'

class UserApiService extends PrivateApiService {
  constructor() {
    super('')
  }
  
  // Lấy danh sách users (Admin only)
  async getUsers(page = 1, perPage = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') {
    return this.paginate(
      API_ENDPOINTS.USERS.LIST,
      page,
      perPage,
      search,
      sortBy,
      sortOrder
    )
  }
  
  // Lấy chi tiết user
  async getUser(id) {
    return this.get(API_ENDPOINTS.USERS.DETAIL(id))
  }
  
  // Cập nhật user (Admin only)
  async updateUser(id, data) {
    return this.put(API_ENDPOINTS.USERS.UPDATE(id), data)
  }
  
  // Xóa user (Admin only)
  async deleteUser(id) {
    return this.delete(API_ENDPOINTS.USERS.DELETE(id))
  }
  
  // Tìm kiếm users
  async searchUsers(query, filters = {}) {
    return this.search('/users/search', query, filters)
  }
  
  // Block/Unblock user
  async toggleBlockUser(id) {
    return this.patch(`/users/${id}/block`)
  }
  
  // Assign role to user
  async assignRole(id, role) {
    return this.post(`/users/${id}/role`, { role })
  }
  
  // Get user permissions
  async getUserPermissions(id) {
    return this.get(`/users/${id}/permissions`)
  }
  
  // Update user permissions
  async updateUserPermissions(id, permissions) {
    return this.put(`/users/${id}/permissions`, { permissions })
  }
  
  // Get user activities
  async getUserActivities(id, page = 1, perPage = 10) {
    return this.paginate(`/users/${id}/activities`, page, perPage)
  }
  
  // Export users (Admin only)
  async exportUsers(format = 'xlsx') {
    return this.get('/users/export', { format })
  }
  
  // Import users (Admin only)
  async importUsers(file) {
    return this.upload('/users/import', file)
  }
  
  // Get user statistics
  async getUserStats() {
    return this.get('/users/stats')
  }
  
  // Send notification to user
  async sendNotification(id, notification) {
    return this.post(`/users/${id}/notifications`, notification)
  }
  
  // Get user notifications
  async getUserNotifications(id, page = 1, perPage = 10) {
    return this.paginate(`/users/${id}/notifications`, page, perPage)
  }
}

// Export instance
export const userApi = new UserApiService()

export default userApi