<template>
  <div class="min-h-screen bg-surface text-text transition-colors duration-150">
    <Header />
    <main class="container mx-auto py-6">
      <router-view />
      
      <!-- modal -->
      <CartModal />
    </main>
  </div>
</template>

<script setup>
  import Header from "./components/Header.vue"
  import CartModal from '@/components/CartModal.vue'
  import { useThemeStore } from '@/store/theme'
  useThemeStore() 
</script>