<script setup>
  import { storeToRefs } from 'pinia'
  import { useCartStore } from '@/store/cart'
  import { useUiStore } from '@/store/ui'

  const cart = useCartStore()
  const { count } = storeToRefs(cart)
  const ui = useUiStore()
  function openCart() {
    ui.openCart()
  }
</script>

<template>
  <button
    type="button"
    class="relative w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
    @click="openCart"
    aria-label="Abrir carrinho"
    :aria-expanded="ui.cartModalOpen"
  >
    <span aria-hidden class="text-lg">🛒</span>
    <span
      class="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[1rem] h-4 rounded-full flex items-center justify-center px-[2px]"
      aria-live="polite"
    >
      {{ count ?? 0 }}
    </span>
  </button>
</template>
