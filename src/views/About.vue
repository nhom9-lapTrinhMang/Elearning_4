<template>
  <div>
    <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-8">
      About {{ appName }}
    </h2>
    
    <div class="max-w-4xl mx-auto">
      <div class="prose prose-lg mx-auto">
        <p class="text-xl text-gray-600 mb-8">
          {{ appName }} is a modern blogging platform built with Vue 3, designed to provide 
          a seamless experience for content creators and readers alike.
        </p>
        
        <h3>Our Mission</h3>
        <p>
          We believe in empowering individuals to share their stories, insights, and expertise 
          with the world. Our platform provides the tools and features needed to create, 
          manage, and distribute content effectively.
        </p>
        
        <h3>Features</h3>
        <ul>
          <li>Modern, responsive design that works on all devices</li>
          <li>Rich text editor for creating beautiful content</li>
          <li>Category and tag management for better organization</li>
          <li>User authentication and role-based access control</li>
          <li>Search functionality to help readers find content</li>
          <li>SEO-friendly URLs and meta tags</li>
          <li>Image upload and management</li>
          <li>Admin dashboard for content management</li>
        </ul>
        
        <h3>Technology Stack</h3>
        <p>
          Built with modern web technologies including:
        </p>
        <ul>
          <li><strong>Vue 3</strong> - Progressive JavaScript framework</li>
          <li><strong>Vite</strong> - Fast build tool and development server</li>
          <li><strong>TailwindCSS</strong> - Utility-first CSS framework</li>
          <li><strong>Pinia</strong> - State management for Vue</li>
          <li><strong>Vue Router</strong> - Official router for Vue.js</li>
          <li><strong>Axios</strong> - HTTP client for API communication</li>
        </ul>
        
        <h3>Get Started</h3>
        <p>
          Ready to start your blogging journey? 
          <router-link to="/register" class="text-primary-600 hover:text-primary-500">
            Create an account
          </router-link> 
          today and begin sharing your stories with the world.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_CONFIG } from '@/config'

const appName = APP_CONFIG.name
</script>