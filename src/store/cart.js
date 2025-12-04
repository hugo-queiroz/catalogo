import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // inicia o localStorage
  const initial = JSON.parse(localStorage.getItem('cart') || '[]')

  // inicia o ref
  const items = ref(initial)

  // salva os itens
  watch(items, (val) => {
    localStorage.setItem('cart', JSON.stringify(val))
  }, { deep: true })
  function add(item) {
    const found = items.value.find(i => i.id === item.id)
    if (found) {
      found.qty += item.qty ?? 1
    } else {
      items.value.push({ ...item, qty: item.qty ?? 1 })
    }
  }
  function remove(id) {
    items.value = items.value.filter(i => i.id !== id)
  }
  function setQty(id, qty) {
    const f = items.value.find(i => i.id === id)
    if (f) f.qty = qty
  }
  const subtotal = computed(() =>
    items.value.reduce((s, it) => s + it.price * it.qty, 0)
  )
  const count = computed(() =>
    items.value.reduce((s, it) => s + it.qty, 0)
  )
  return { items, add, remove, setQty, subtotal, count }
})
