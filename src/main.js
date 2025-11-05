import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
  
  // In production, you might want to send this to a logging service
  if (import.meta.env.PROD) {
    // sendToLoggingService(error, instance, info)
  }
}

// Global properties (if needed)
app.config.globalProperties.$filters = {
  capitalize(value) {
    if (!value) return ''
    return value.toString().charAt(0).toUpperCase() + value.slice(1)
  },
  
  currency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  },
  
  date(value, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    return new Date(value).toLocaleDateString('en-US', { ...defaultOptions, ...options })
  }
}

// Mount app
app.mount('#app')

// Enable Vue DevTools in development
if (import.meta.env.DEV) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = window.__VUE_DEVTOOLS_GLOBAL_HOOK__ || {}
}