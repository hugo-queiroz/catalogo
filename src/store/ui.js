import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const cartModalOpen = ref(false)
  function openCart() { cartModalOpen.value = true }
  function closeCart() { cartModalOpen.value = false }
  function toggleCart() { cartModalOpen.value = !cartModalOpen.value }
  return { cartModalOpen, openCart, closeCart, toggleCart }
})