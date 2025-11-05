import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, guestGuard, adminGuard, initializeAuth } from './guards'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Public routes
const publicRoutes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { title: 'Home' }
      },
      {
        path: '/blogs',
        name: 'blogs',
        component: () => import('@/views/BlogList.vue'),
        meta: { title: 'Blogs' }
      },
      {
        path: '/blogs/:slug',
        name: 'blog-detail',
        component: () => import('@/views/BlogDetail.vue'),
        meta: { title: 'Blog Detail' }
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/About.vue'),
        meta: { title: 'About' }
      },
      {
        path: '/contact',
        name: 'contact',
        component: () => import('@/views/Contact.vue'),
        meta: { title: 'Contact' }
      }
    ]
  }
]

// Auth routes
const authRoutes = [
  {
    path: '/auth',
    component: AuthLayout,
    beforeEnter: guestGuard,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { title: 'Login' }
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { title: 'Register' }
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPassword.vue'),
        meta: { title: 'Forgot Password' }
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPassword.vue'),
        meta: { title: 'Reset Password' }
      }
    ]
  }
]

// Protected routes
const protectedRoutes = [
  {
    path: '/dashboard',
    component: DefaultLayout,
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: 'Profile' }
      }
    ]
  }
]

// Admin routes
const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: adminGuard,
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: 'Admin Dashboard' }
      },
      {
        path: 'blogs',
        name: 'admin-blogs',
        component: () => import('@/views/admin/BlogList.vue'),
        meta: { title: 'Manage Blogs' }
      },
      {
        path: 'blogs/create',
        name: 'admin-blog-create',
        component: () => import('@/views/admin/BlogForm.vue'),
        meta: { title: 'Create Blog' }
      },
      {
        path: 'blogs/:id/edit',
        name: 'admin-blog-edit',
        component: () => import('@/views/admin/BlogForm.vue'),
        meta: { title: 'Edit Blog' }
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/CategoryList.vue'),
        meta: { title: 'Manage Categories' }
      },
      {
        path: 'tags',
        name: 'admin-tags',
        component: () => import('@/views/admin/TagList.vue'),
        meta: { title: 'Manage Tags' }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/UserList.vue'),
        meta: { title: 'Manage Users' }
      }
    ]
  }
]

// Error routes
const errorRoutes = [
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/errors/Unauthorized.vue'),
    meta: { title: '401 - Unauthorized' }
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: () => import('@/views/errors/NotFound.vue'),
    meta: { title: '404 - Not Found' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found'
  }
]

// Combine all routes
const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...adminRoutes,
  ...errorRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when changing pages
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach(initializeAuth)

// Update document title
router.afterEach((to) => {
  const appName = import.meta.env.VITE_APP_NAME || 'Vue 3 Project'
  document.title = to.meta?.title ? `${to.meta.title} - ${appName}` : appName
})

export default router