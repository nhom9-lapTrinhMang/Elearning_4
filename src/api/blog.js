import { PrivateApiService, PublicApiService } from './base'
import { API_ENDPOINTS } from '@/config'

class BlogApiService extends PrivateApiService {
  constructor() {
    super('')
  }
  
  // Lấy danh sách blogs (có phân trang)
  async getBlogs(page = 1, perPage = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') {
    return this.paginate(
      API_ENDPOINTS.BLOGS.LIST,
      page,
      perPage,
      search,
      sortBy,
      sortOrder
    )
  }
  
  // Lấy chi tiết blog
  async getBlog(id) {
    return this.get(API_ENDPOINTS.BLOGS.DETAIL(id))
  }
  
  // Tạo blog mới
  async createBlog(data) {
    return this.post(API_ENDPOINTS.BLOGS.CREATE, data)
  }
  
  // Cập nhật blog
  async updateBlog(id, data) {
    return this.put(API_ENDPOINTS.BLOGS.UPDATE(id), data)
  }
  
  // Xóa blog
  async deleteBlog(id) {
    return this.delete(API_ENDPOINTS.BLOGS.DELETE(id))
  }
  
  // Upload hình ảnh cho blog
  async uploadImage(id, file, additionalData = {}) {
    return this.upload(API_ENDPOINTS.BLOGS.UPLOAD(id), file, additionalData)
  }
  
  // Tìm kiếm blogs
  async searchBlogs(query, filters = {}) {
    return this.search(API_ENDPOINTS.BLOGS.SEARCH, query, filters)
  }
  
  // Lấy blogs theo category
  async getBlogsByCategory(categoryId, page = 1, perPage = 10) {
    return this.paginate(`/blogs/category/${categoryId}`, page, perPage)
  }
  
  // Lấy blogs của user
  async getUserBlogs(userId, page = 1, perPage = 10) {
    return this.paginate(`/blogs/user/${userId}`, page, perPage)
  }
  
  // Lấy blogs phổ biến
  async getPopularBlogs(limit = 10) {
    return this.get('/blogs/popular', { limit })
  }
  
  // Lấy blogs mới nhất
  async getLatestBlogs(limit = 10) {
    return this.get('/blogs/latest', { limit })
  }
  
  // Like/Unlike blog
  async toggleLike(id) {
    return this.post(`/blogs/${id}/like`)
  }
  
  // Comment trên blog
  async addComment(id, comment) {
    return this.post(`/blogs/${id}/comments`, { comment })
  }
  
  // Lấy comments của blog
  async getComments(id, page = 1, perPage = 10) {
    return this.paginate(`/blogs/${id}/comments`, page, perPage)
  }
  
  // Xóa comment
  async deleteComment(blogId, commentId) {
    return this.delete(`/blogs/${blogId}/comments/${commentId}`)
  }
  
  // Publish/Unpublish blog
  async togglePublish(id) {
    return this.patch(`/blogs/${id}/publish`)
  }
  
  // Lấy stats của blog
  async getBlogStats(id) {
    return this.get(`/blogs/${id}/stats`)
  }
}

// Public Blog API (không cần auth cho việc đọc)
class PublicBlogApiService extends PublicApiService {
  constructor() {
    super('')
  }
  
  // Lấy blogs public (chỉ các blog đã publish)
  async getPublicBlogs(page = 1, perPage = 10, search = '') {
    return this.paginate('/blogs/public', page, perPage, search)
  }
  
  // Lấy chi tiết blog public
  async getPublicBlog(slug) {
    return this.get(`/blogs/public/${slug}`)
  }
  
  // Tìm kiếm blogs public
  async searchPublicBlogs(query, filters = {}) {
    return this.search('/blogs/public/search', query, filters)
  }
  
  // Lấy categories
  async getCategories() {
    return this.get('/categories')
  }
  
  // Lấy tags
  async getTags() {
    return this.get('/tags')
  }
}

// Category API
class CategoryApiService extends PrivateApiService {
  constructor() {
    super('/categories')
  }
  
  // Lấy danh sách categories
  async getCategories() {
    return this.get()
  }
  
  // Tạo category
  async createCategory(data) {
    return this.post('', data)
  }
  
  // Cập nhật category
  async updateCategory(id, data) {
    return this.put(`/${id}`, data)
  }
  
  // Xóa category
  async deleteCategory(id) {
    return this.delete(`/${id}`)
  }
}

// Tag API
class TagApiService extends PrivateApiService {
  constructor() {
    super('/tags')
  }
  
  // Lấy danh sách tags
  async getTags() {
    return this.get()
  }
  
  // Tạo tag
  async createTag(data) {
    return this.post('', data)
  }
  
  // Cập nhật tag
  async updateTag(id, data) {
    return this.put(`/${id}`, data)
  }
  
  // Xóa tag
  async deleteTag(id) {
    return this.delete(`/${id}`)
  }
  
  // Tìm kiếm tags
  async searchTags(query) {
    return this.search('', query)
  }
}

// Export instances
export const blogApi = new BlogApiService()
export const publicBlogApi = new PublicBlogApiService()
export const categoryApi = new CategoryApiService()
export const tagApi = new TagApiService()

export default {
  blogApi,
  publicBlogApi,
  categoryApi,
  tagApi,
}