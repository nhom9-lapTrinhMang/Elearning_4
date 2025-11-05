// API Response Structure
export class ApiResponse {
  constructor(data, message = '', status = 200, errors = null) {
    this.success = status >= 200 && status < 300
    this.status = status
    this.message = message
    this.data = data
    this.errors = errors
    this.timestamp = new Date().toISOString()
  }
  
  static success(data, message = 'Success') {
    return new ApiResponse(data, message, 200)
  }
  
  static error(message = 'Error', status = 500, errors = null) {
    return new ApiResponse(null, message, status, errors)
  }
  
  static validationError(errors, message = 'Validation failed') {
    return new ApiResponse(null, message, 422, errors)
  }
}

// API Request Structure
export class ApiRequest {
  constructor(endpoint, method = 'GET', data = null, params = null, config = {}) {
    this.endpoint = endpoint
    this.method = method.toUpperCase()
    this.data = data
    this.params = params
    this.config = {
      ...config,
      timeout: config.timeout || 10000,
    }
  }
  
  // Thêm query parameters
  withParams(params) {
    this.params = { ...this.params, ...params }
    return this
  }
  
  // Thêm headers
  withHeaders(headers) {
    this.config.headers = { ...this.config.headers, ...headers }
    return this
  }
  
  // Set timeout
  withTimeout(timeout) {
    this.config.timeout = timeout
    return this
  }
  
  // Set request data
  withData(data) {
    this.data = data
    return this
  }
}

// Pagination Request
export class PaginationRequest extends ApiRequest {
  constructor(endpoint, page = 1, perPage = 10, search = '', sortBy = '', sortOrder = 'asc') {
    super(endpoint, 'GET')
    this.withParams({
      page,
      per_page: perPage,
      search,
      sort_by: sortBy,
      sort_order: sortOrder,
    })
  }
  
  withSearch(search) {
    this.params.search = search
    return this
  }
  
  withSort(sortBy, sortOrder = 'asc') {
    this.params.sort_by = sortBy
    this.params.sort_order = sortOrder
    return this
  }
  
  withPage(page) {
    this.params.page = page
    return this
  }
  
  withPerPage(perPage) {
    this.params.per_page = perPage
    return this
  }
}

// Upload Request
export class UploadRequest extends ApiRequest {
  constructor(endpoint, file, additionalData = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    // Thêm các dữ liệu khác
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })
    
    super(endpoint, 'POST', formData)
    this.withHeaders({
      'Content-Type': 'multipart/form-data'
    })
  }
}

// Error Handler
export class ApiError extends Error {
  constructor(message, status, response = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.response = response
  }
  
  static fromAxiosError(error) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || error.message || 'Unknown error'
    const response = error.response?.data || null
    
    return new ApiError(message, status, response)
  }
  
  isValidationError() {
    return this.status === 422
  }
  
  isUnauthorized() {
    return this.status === 401
  }
  
  isForbidden() {
    return this.status === 403
  }
  
  isNotFound() {
    return this.status === 404
  }
  
  isServerError() {
    return this.status >= 500
  }
}