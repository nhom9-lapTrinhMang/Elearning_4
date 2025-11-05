<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <main class="flex-1">
      <router-view />
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>