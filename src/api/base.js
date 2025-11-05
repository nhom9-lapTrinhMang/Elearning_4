import axiosInstance from './axiosInstance'
import { ApiError, ApiRequest, PaginationRequest, UploadRequest } from './types'

// Base API Service
export class BaseApiService {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint
  }
  
  // Execute API request
  async execute(request) {
    try {
      const response = await axiosInstance({
        url: request.endpoint,
        method: request.method,
        data: request.data,
        params: request.params,
        ...request.config,
      })
      
      return response.data
    } catch (error) {
      throw ApiError.fromAxiosError(error)
    }
  }
  
  // GET request
  async get(endpoint = '', params = null) {
    const request = new ApiRequest(
      `${this.baseEndpoint}${endpoint}`,
      'GET',
      null,
      params
    )
    return this.execute(request)
  }
  
  // POST request
  async post(endpoint = '', data = null) {
    const request = new ApiRequest(
      `${this.baseEndpoint}${endpoint}`,
      'POST',
      data
    )
    return this.execute(request)
  }
  
  // PUT request
  async put(endpoint = '', data = null) {
    const request = new ApiRequest(
      `${this.baseEndpoint}${endpoint}`,
      'PUT',
      data
    )
    return this.execute(request)
  }
  
  // PATCH request
  async patch(endpoint = '', data = null) {
    const request = new ApiRequest(
      `${this.baseEndpoint}${endpoint}`,
      'PATCH',
      data
    )
    return this.execute(request)
  }
  
  // DELETE request
  async delete(endpoint = '') {
    const request = new ApiRequest(
      `${this.baseEndpoint}${endpoint}`,
      'DELETE'
    )
    return this.execute(request)
  }
  
  // Paginated GET request
  async paginate(endpoint = '', page = 1, perPage = 10, search = '', sortBy = '', sortOrder = 'asc') {
    const request = new PaginationRequest(
      `${this.baseEndpoint}${endpoint}`,
      page,
      perPage,
      search,
      sortBy,
      sortOrder
    )
    return this.execute(request)
  }
  
  // Upload file
  async upload(endpoint = '', file, additionalData = {}) {
    const request = new UploadRequest(
      `${this.baseEndpoint}${endpoint}`,
      file,
      additionalData
    )
    return this.execute(request)
  }
  
  // Search
  async search(endpoint = '', query, filters = {}) {
    const params = {
      q: query,
      ...filters,
    }
    return this.get(endpoint, params)
  }
}

// Public API Service (không cần authentication)
export class PublicApiService extends BaseApiService {
  constructor(baseEndpoint) {
    super(baseEndpoint)
  }
  
  async execute(request) {
    try {
      // Tạo axios instance riêng không có Authorization header
      const publicAxios = axiosInstance.create()
      delete publicAxios.defaults.headers.common['Authorization']
      
      const response = await publicAxios({
        url: request.endpoint,
        method: request.method,
        data: request.data,
        params: request.params,
        ...request.config,
      })
      
      return response.data
    } catch (error) {
      throw ApiError.fromAxiosError(error)
    }
  }
}

// Private API Service (cần authentication)
export class PrivateApiService extends BaseApiService {
  constructor(baseEndpoint) {
    super(baseEndpoint)
  }
  
  // Override execute để đảm bảo có token
  async execute(request) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new ApiError('Authentication required', 401)
    }
    
    return super.execute(request)
  }
}

export default BaseApiService