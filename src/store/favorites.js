import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref([])
  // carrega o localStorage ao iniciar
  const stored = localStorage.getItem('favorites')
  items.value = stored ? JSON.parse(stored) : []

  // alterna favorito por ID
  function toggle(productId) {
    const id = String(productId)

    if (items.value.includes(id)) {
      items.value = items.value.filter(f => f !== id)
    } else {
      items.value.push(id)
    }
  }
  
  // verifica se é favorito
  function isFavorite(productId) {
    return items.value.includes(String(productId))
  }
  watch(
    items,
    (val) => {
      localStorage.setItem('favorites', JSON.stringify(val))
    },
    { deep: true }
  )
  return { items, toggle, isFavorite }
})
