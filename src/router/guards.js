import { useAuthStore } from '@/store/auth'

// Navigation guard để kiểm tra authentication
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Redirect to login với redirect parameter
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

// Navigation guard để kiểm tra guest (chưa đăng nhập)
export const guestGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    // Redirect to dashboard nếu đã đăng nhập
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

// Navigation guard để kiểm tra admin role
export const adminGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (!authStore.isAdmin) {
    // Redirect to unauthorized page
    next({ name: 'unauthorized' })
  } else {
    next()
  }
}

// Navigation guard để kiểm tra moderator role
export const moderatorGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (!authStore.isModerator) {
    // Redirect to unauthorized page
    next({ name: 'unauthorized' })
  } else {
    next()
  }
}

// Navigation guard để kiểm tra permissions
export const permissionGuard = (permissions) => {
  return (to, from, next) => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else if (!authStore.hasAnyPermission(permissions)) {
      // Redirect to unauthorized page
      next({ name: 'unauthorized' })
    } else {
      next()
    }
  }
}

// Navigation guard để kiểm tra ownership (user chỉ có thể truy cập resource của mình)
export const ownershipGuard = (resourceKey = 'id') => {
  return (to, from, next) => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      const resourceId = to.params[resourceKey]
      const userId = authStore.user?.id
      
      // Admin có thể truy cập tất cả
      if (authStore.isAdmin || resourceId == userId) {
        next()
      } else {
        next({ name: 'unauthorized' })
      }
    }
  }
}

// Global navigation guard để initialize auth
export const initializeAuth = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Chỉ initialize một lần
  if (authStore.token && !authStore.user) {
    try {
      await authStore.initAuth()
    } catch (error) {
      console.error('Auth initialization error:', error)
      // Clear invalid token
      authStore.logout()
    }
  }
  
  next()
}

// Helper function để tạo route với guards
export const createProtectedRoute = (route, guards = []) => {
  return {
    ...route,
    beforeEnter: (to, from, next) => {
      // Chạy các guards theo thứ tự
      const runGuards = async (guardIndex = 0) => {
        if (guardIndex >= guards.length) {
          next()
          return
        }
        
        const guard = guards[guardIndex]
        guard(to, from, (nextRoute) => {
          if (nextRoute === true || nextRoute === undefined) {
            runGuards(guardIndex + 1)
          } else {
            next(nextRoute)
          }
        })
      }
      
      runGuards()
    }
  }
}

export default {
  authGuard,
  guestGuard,
  adminGuard,
  moderatorGuard,
  permissionGuard,
  ownershipGuard,
  initializeAuth,
  createProtectedRoute,
}