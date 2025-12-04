<script setup>
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import { Teleport } from 'vue'
  import { useUiStore } from '@/store/ui'
  import { useCartStore } from '@/store/cart'
  import { useFavoritesStore } from '@/store/favorites'

  const ui = useUiStore()
  const cart = useCartStore()
  const favorites = useFavoritesStore()
  const modalRef = ref(null)
  let previouslyFocused = null

  // focus trap como solicitado
  function getFocusableElements(container) {
    if (!container) return []
    return Array.from(
      container.querySelectorAll("a[href], button, textarea, input, select, [tabindex]:not([tabindex='-1'])")
    ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
  }
  function handleKeyDown(e) {
    if (!ui.cartModalOpen) return
    if (e.key === 'Escape') {
      e.preventDefault()
      ui.closeCart()
      return
    }
    if (e.key === 'Tab') {
      const focusables = getFocusableElements(modalRef.value)
      if (focusables.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }

  // fecha o modal se clicar fora
  function onMouseDown(e) {
    if (!modalRef.value) return
    if (!modalRef.value.contains(e.target)) {
      ui.closeCart()
    }
  }

  // trava o foco ao sair
  watch(
    () => ui.cartModalOpen,
    async (open) => {
      if (open) {
        previouslyFocused = document.activeElement
        document.body.style.overflow = 'hidden'
        await nextTick()
        const f = getFocusableElements(modalRef.value)[0]
        if (f) f.focus()
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('mousedown', onMouseDown)
      } else {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', onMouseDown)
        // restaura o foco
        if (previouslyFocused && previouslyFocused.focus) {
          previouslyFocused.focus()
        }
      }
    },
    { immediate: false }
  )

  onUnmounted(() => {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('mousedown', onMouseDown)
  })

  function removeItem(id) {
    cart.remove(id)
  }

  function decrease(item) {
    cart.setQty(item.id, Math.max(1, item.qty - 1))
  }
  function increase(item) {
    cart.setQty(item.id, item.qty + 1)
  }
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="ui.cartModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        aria-modal="true"
        role="dialog"
        aria-label="Visualização do carrinho"
      >
        <!-- wrapper para detectar clique fora -->
        <div class="w-full max-w-2xl mx-auto">
          <!-- conteúdo do modal -->
          <div
            ref="modalRef"
            class="bg-base rounded-2xl shadow-xl overflow-hidden"
            role="document"
            @mousedown.stop
          >
            <!-- header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 class="text-lg font-semibold">Cart Preview</h3>
              <!-- x -->
              <button
                @click="ui.closeCart()"
                class="p-2 rounded-full text-text hover:bg-border"
                aria-label="Fechar"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>
            <!-- body -->
            <div class="px-6 py-4">
              <div v-if="cart.items.length" class="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4">
                  <img :src="item.image" class="w-16 h-16 rounded-md object-cover" :alt="item.name" />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate">{{ item.name }}</p>
                    <p class="text-sm text-text/70 truncate">{{ item.category }}</p>
                    <!-- botão para favoritar -->
                    <div class="mt-2">
                      <button
                        @click="favorites.toggle(item.id)"
                        class="text-sm underline text-text hover:text-text"
                      >
                        {{ favorites.isFavorite(item.id) ? 'Remover dos favoritos' : 'Favoritar' }}
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="decrease(item)"
                      class="w-8 h-8 rounded border flex items-center justify-center text-text hover:bg-border/80"
                      aria-label="Diminuir quantidade"
                    >−</button>
                    <div class="w-8 text-center">{{ item.qty }}</div>
                    <button
                      @click="increase(item)"
                      class="w-8 h-8 rounded border flex items-center justify-center text-text hover:bg-border/80"
                      aria-label="Aumentar quantidade"
                    >+</button>
                  </div>
                  <div class="w-24 text-right font-medium">
                    R$ {{ (item.price * item.qty).toFixed(2) }}
                  </div>
                  <div class="pl-2">
                    <button
                      @click="removeItem(item.id)"
                      class="text-sm text-red-500 hover:underline"
                      aria-label="Remover item"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>

              <!-- mensagem caso o carrinho esteja vazio -->
              <div v-else class="py-10 text-center text-neutral-500">
                Seu carrinho está vazio.
              </div>
            </div>

            <div class="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm">Subtotal</span>
                <span class="font-semibold">R$ {{ cart.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-end gap-3">
                <button
                  @click="ui.closeCart()"
                  class="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button class="px-5 py-2 rounded-lg bg-primary text-base hover:bg-primary/80">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>