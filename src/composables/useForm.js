import { ref } from 'vue'

export function useForm(initialValues = {}, validationRules = {}) {
  const form = ref({ ...initialValues })
  const errors = ref({})
  const loading = ref(false)
  
  // Reset form to initial values
  const reset = () => {
    form.value = { ...initialValues }
    errors.value = {}
  }
  
  // Clear all errors
  const clearErrors = () => {
    errors.value = {}
  }
  
  // Clear specific field error
  const clearFieldError = (field) => {
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }
  
  // Set errors (from API response)
  const setErrors = (newErrors) => {
    errors.value = newErrors || {}
  }
  
  // Set single field error
  const setFieldError = (field, message) => {
    errors.value[field] = Array.isArray(message) ? message : [message]
  }
  
  // Validate single field
  const validateField = (field) => {
    const rules = validationRules[field]
    if (!rules) return true
    
    const value = form.value[field]
    const fieldErrors = []
    
    for (const rule of rules) {
      const result = rule(value, form.value)
      if (result !== true) {
        fieldErrors.push(result)
      }
    }
    
    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors
      return false
    } else {
      clearFieldError(field)
      return true
    }
  }
  
  // Validate all fields
  const validate = () => {
    clearErrors()
    let isValid = true
    
    for (const field in validationRules) {
      if (!validateField(field)) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  // Check if field has error
  const hasError = (field) => {
    return !!(errors.value[field] && errors.value[field].length > 0)
  }
  
  // Get field error message
  const getError = (field) => {
    return errors.value[field]?.[0] || ''
  }
  
  // Get all field errors
  const getErrors = (field) => {
    return errors.value[field] || []
  }
  
  // Check if form is valid
  const isValid = () => {
    return Object.keys(errors.value).length === 0
  }
  
  // Get form data
  const getData = () => {
    return { ...form.value }
  }
  
  // Set form data
  const setData = (data) => {
    form.value = { ...form.value, ...data }
  }
  
  // Submit form with validation
  const submit = async (submitFn) => {
    if (!validate()) {
      return { success: false, message: 'Please fix validation errors' }
    }
    
    try {
      loading.value = true
      const result = await submitFn(getData())
      
      if (!result.success && result.errors) {
        setErrors(result.errors)
      }
      
      return result
    } catch (error) {
      console.error('Form submission error:', error)
      return { success: false, message: 'An unexpected error occurred' }
    } finally {
      loading.value = false
    }
  }
  
  return {
    form,
    errors,
    loading,
    reset,
    clearErrors,
    clearFieldError,
    setErrors,
    setFieldError,
    validateField,
    validate,
    hasError,
    getError,
    getErrors,
    isValid,
    getData,
    setData,
    submit,
  }
}

// Common validation rules
export const validationRules = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required'
    }
    return true
  },
  
  email: (value) => {
    if (!value) return true // Skip if empty (use required rule separately)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value) || 'Invalid email format'
  },
  
  minLength: (min) => (value) => {
    if (!value) return true
    return value.length >= min || `Minimum ${min} characters required`
  },
  
  maxLength: (max) => (value) => {
    if (!value) return true
    return value.length <= max || `Maximum ${max} characters allowed`
  },
  
  min: (minValue) => (value) => {
    if (value === null || value === undefined || value === '') return true
    return Number(value) >= minValue || `Minimum value is ${minValue}`
  },
  
  max: (maxValue) => (value) => {
    if (value === null || value === undefined || value === '') return true
    return Number(value) <= maxValue || `Maximum value is ${maxValue}`
  },
  
  number: (value) => {
    if (!value) return true
    return !isNaN(value) || 'Must be a valid number'
  },
  
  integer: (value) => {
    if (!value) return true
    return Number.isInteger(Number(value)) || 'Must be a valid integer'
  },
  
  url: (value) => {
    if (!value) return true
    try {
      new URL(value)
      return true
    } catch {
      return 'Invalid URL format'
    }
  },
  
  phone: (value) => {
    if (!value) return true
    const re = /^[\+]?[1-9][\d]{0,15}$/
    return re.test(value.replace(/\s/g, '')) || 'Invalid phone number'
  },
  
  password: (value) => {
    if (!value) return true
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
    return true
  },
  
  confirmed: (field) => (value, form) => {
    return value === form[field] || 'Confirmation does not match'
  },
  
  slug: (value) => {
    if (!value) return true
    const re = /^[a-z0-9-]+$/
    return re.test(value) || 'Slug can only contain lowercase letters, numbers, and hyphens'
  },
  
  regex: (pattern, message = 'Invalid format') => (value) => {
    if (!value) return true
    return pattern.test(value) || message
  },
  
  fileType: (allowedTypes) => (file) => {
    if (!file) return true
    return allowedTypes.includes(file.type) || `Allowed file types: ${allowedTypes.join(', ')}`
  },
  
  fileSize: (maxSize) => (file) => {
    if (!file) return true
    return file.size <= maxSize || `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
  },
}