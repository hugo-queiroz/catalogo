<template>
  <main class="container mx-auto py-8">
    <!-- skeleton de loading -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- skeleton da galeria -->
        <div class="w-full md:w-1/2">
          <div class="relative bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden">
            <div class="w-full h-[420px] bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
          </div>
          <!-- skeleton das thumbs -->
          <div class="mt-4">
            <div class="flex gap-3 overflow-x-auto pb-2">
              <div class="flex-shrink-0 w-20 h-14 rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
              <div class="flex-shrink-0 w-20 h-14 rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
              <div class="flex-shrink-0 w-20 h-14 rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
              <div class="flex-shrink-0 w-20 h-14 rounded-md bg-neutral-200 dark:bg-neutral-800"></div>
            </div>
          </div>
        </div>
        <!-- skeleton dos detalhes -->
        <div class="flex-1 space-y-4">
          <!-- titulo -->
          <div class="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
          <!-- categoria -->
          <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
          <!-- avaliação -->
          <div class="flex items-center gap-4 mt-2">
            <div class="flex gap-1">
              <div class="w-32 h-5 rounded bg-neutral-200 dark:bg-neutral-800"></div>
            </div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16"></div>
          </div>
          <!-- preço -->
          <div class="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-40 mt-2"></div>
          <!-- descrição -->
          <div class="space-y-2 mt-4">
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6"></div>
            <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3"></div>
          </div>
          <!-- CTAs -->
          <div class="flex gap-4 mt-4">
            <div class="h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 w-44"></div>
            <div class="h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 w-32"></div>
          </div>
          <!-- volta pra home -->
          <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-16 mt-2"></div>
        </div>
      </div>
    </div>

    <!-- caso o produto não exista -->
    <div v-else-if="!product" class="text-center text-text py-20">
      <p class="text-xl font-semibold">Produto não encontrado.</p>
      <router-link to="/" class="inline-block mt-4 underline text-text">Voltar à página inicial</router-link>
    </div>
    <!-- conteúdo do produto -->
    <div v-else class="flex flex-col md:flex-row gap-8 relative">
      <transition name="fade">
        <div v-if="tempMessage" class="absolute inset-0 z-40 flex items-start justify-center pt-12 pointer-events-none" aria-live="polite">
          <div class="bg-primary text-white px-4 py-2 rounded-md font-medium pointer-events-auto">
            {{ tempMessage }}
          </div>
        </div>
      </transition>

      <!-- galeria -->
      <div
        class="w-full md:w-1/2 rounded-xl overflow-hidden select-none"
        @keydown.left.prevent="prev"
        @keydown.right.prevent="next"
        tabindex="0"
        ref="galleryEl"
        aria-label="Galeria de imagens do produto"
      >
        <div
          class="relative bg-base rounded-xl overflow-hidden"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <transition name="fade" mode="out-in">
            <img
              :key="currentImage"
              :src="currentImage"
              :alt="`${product.name} - imagem ${currentIndex + 1}`"
              class="w-full h-[420px] object-cover bg-white dark:bg-neutral-800"
              loading="lazy"
            />
          </transition>
          <!-- arrow esquerda -->
          <button
            @click.prevent="prev"
            class="absolute left-3 top-1/2 -translate-y-1/2 bg-base p-2 rounded-full shadow hover:scale-105 transition"
            :aria-label="'Imagem anterior'"
            :disabled="images.length <= 1"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-800 dark:text-neutral-100" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.707 3.707a1 1 0 010 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
          <!-- arrow direita  -->
          <button
            @click.prevent="next"
            class="absolute right-3 top-1/2 -translate-y-1/2 bg-base p-2 rounded-full shadow hover:scale-105 transition"
            :aria-label="'Próxima imagem'"
            :disabled="images.length <= 1"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
          <!-- dots do carrossel -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              v-for="(img, idx) in images"
              :key="idx"
              @click="selectIndex(idx)"
              type="button"
              class="w-2 h-2 rounded-full transition"
              :class="idx === currentIndex
                ? 'bg-neutral-900 dark:bg-neutral-100 scale-110'
                : 'bg-neutral-300 dark:bg-neutral-700 hover:scale-110'"
              aria-label="Ir para imagem {{ idx + 1 }}"
            ></button>
          </div>
        </div>

        <!-- thumbs -->
        <div class="mt-4">
          <div class="flex gap-3 overflow-x-auto pb-2">
            <button
              v-for="(img, idx) in images"
              :key="idx"
              @click="selectIndex(idx)"
              :aria-label="`Ir para imagem ${idx + 1}`"
              type="button"
              class="flex-shrink-0 w-20 h-14 rounded-md overflow-hidden border transition focus:outline-none"
              :class="idx === currentIndex ? 'border-2 border-primary border-transparent' : 'border-neutral-200 dark:border-neutral-800'"
            >
              <img :src="img" :alt="`${product.name} mini ${idx + 1}`" class="w-full h-full object-cover" loading="lazy" />
            </button>
          </div>
        </div>
      </div>

      <!-- detalhes -->
      <div class="flex-1">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-2xl font-semibold text-text">{{ product.name }}</h1>
            <p class="text-text/80 mt-2">{{ product.category }}</p>
            <!-- avaliação -->
            <div class="flex items-end mt-3" aria-label="Avaliação do produto">
              <div class="flex items-center">
                <span v-for="n in 5" :key="n" class="inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 inline-block text-neutral-200 dark:text-neutral-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true">
                    <path stroke="none" fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.044 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.285-3.96z"/>
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 inline-block -ml-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true">
                    <defs>
                      <clipPath :id="`star-clip-${product.id}-${n}`">
                        <rect :width="(starFill(n) * 100) + '%'" height="100%" x="0" y="0" />
                      </clipPath>
                    </defs>
                    <g :clip-path="`url(#star-clip-${product.id}-${n})`">
                      <path stroke="none" fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.044 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.285-3.96z"/>
                    </g>
                  </svg>
                </span>
              </div>

              <span class="text-sm text-text ml-2">
                {{ product.rating ? product.rating.toFixed(1) : '0.0' }} · ({{ product.reviews || 0 }})
              </span>
            </div>

            <p class="text-3xl font-bold mt-4 text-text">R$ {{ product.price.toFixed(2) }}</p>
          </div>

          <!-- botão para favoritar -->
          <div>
            <button
              @click.stop="toggleFavorite"
              :aria-pressed="isFav"
              aria-label="Favoritar produto"
              type="button"
              class="rounded-full p-2 shadow bg-border/80 hover:scale-110 transition"
            >
              <svg v-if="isFav" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18l-6.828-6.828a4 4 0 010-5.656z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-500 dark:text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"/>
              </svg>
            </button>
          </div>
        </div>

        <p class="mt-6 text-text leading-relaxed">{{ product.description || "Descrição não disponível." }}</p>

        <!-- btn para adicionar ao carrinho -->
        <div class="flex gap-4 mt-8 items-center">
          <button
            @click.prevent="handleCartToggle"
            type="button"
            :aria-pressed="inCart"
            class="px-4 py-2 rounded-lg font-semibold transition shadow"
            :class="inCart ? 'bg-[#ddd] text-black hover:bg-[#ccc]' : 'bg-primary text-white hover:bg-primary/80'"
          >
            {{ inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho' }}
          </button>

          <button v-if="!inCart" @click="openCartPreview" type="button" class="px-3 py-2 rounded-lg border border-border text-text">
            Visualizar carrinho
          </button>
        </div>

        <router-link to="/" class="inline-block mt-6 text-sm underline text-text">Voltar</router-link>
      </div>
    </div>

    <section v-if="isLoading || relatedProducts.length" class="mt-12">
      <h2 class="text-xl font-semibold text-text">Produtos relacionados</h2>
      <p class="text-sm text-text/60 mt-1">Da mesma categoria: <strong>{{ product?.category }}</strong></p>

      <!-- skeletons para os relacionados -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        <div v-for="n in 4" :key="'related-skel-'+n" class="w-full p-4 bg-white dark:bg-neutral-900 rounded-lg shadow animate-pulse">
          <div class="w-full h-40 bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded mt-3 w-3/4"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-800 rounded mt-2 w-1/2"></div>
          <div class="flex items-center gap-2 mt-4">
            <div class="h-8 rounded bg-neutral-200 dark:bg-neutral-800 w-24"></div>
            <div class="h-8 rounded bg-neutral-200 dark:bg-neutral-800 w-10"></div>
          </div>
        </div>
      </div>
      <div v-else-if="relatedProducts.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
        <div v-for="p in relatedProducts" :key="p.id" class="w-full">
          <ProductCard
            :product="p"
          />
        </div>
      </div>
    </section>

    <!-- mensagem caso não haja nenhuma relacionado -->
    <section v-else class="mt-12" v-if="!isLoading && product">
      <p class="text-sm text-neutral-500 dark:text-neutral-400">Nenhum produto relacionado encontrado.</p>
    </section>
  </main>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import PRODUCTS from '@/data/products.json'
  import { useFavoritesStore } from '@/store/favorites'
  import { useCartStore } from '@/store/cart'
  import { useUiStore } from '@/store/ui'
  import { storeToRefs } from 'pinia'
  import ProductCard from '@/components/ProductCard.vue'

  const route = useRoute()
  const product = ref(null)
  const isLoading = ref(true)
  const favorites = useFavoritesStore()
  const cart = useCartStore()
  const ui = useUiStore()
  const { items } = storeToRefs(cart)
  const tempMessage = ref(null)
  let timer = null
  function clearTemp() {
    clearTimeout(timer)
    timer = null
    tempMessage.value = null
  }
  /* galeria */
  const galleryEl = ref(null)
  const currentIndex = ref(0)
  const touchStartX = ref(null)
  const touchEndX = ref(null)
  const images = computed(() => {
    if (!product.value) return []
    if (Array.isArray(product.value.images) && product.value.images.length) return product.value.images
    return [product.value.image]
  })
  const currentImage = computed(() => images.value[currentIndex.value] || '')
  function clampIndex(i) {
    const len = images.value.length || 1
    if (i < 0) return len - 1
    if (i >= len) return 0
    return i
  }
  function prev() {
    currentIndex.value = clampIndex(currentIndex.value - 1)
  }
  function next() {
    currentIndex.value = clampIndex(currentIndex.value + 1)
  }
  function selectIndex(i) {
    currentIndex.value = clampIndex(i)
  }
  function onTouchStart(e) {
    touchStartX.value = e.changedTouches[0].clientX
  }
  function onTouchEnd(e) {
    touchEndX.value = e.changedTouches[0].clientX
    if (touchStartX.value == null) return
    const diff = touchEndX.value - touchStartX.value
    const threshold = 40 // px
    if (diff > threshold) {
      prev()
    } else if (diff < -threshold) {
      next()
    }
    touchStartX.value = null
    touchEndX.value = null
  }
  // carregamento do produto
  async function loadProduct() {
    isLoading.value = true
    const id = Number(route.params.id)
    setTimeout(() => {
      product.value = PRODUCTS.find(p => p.id === id) || null
      currentIndex.value = 0
      isLoading.value = false
    }, 300)
  }
  onMounted(() => {
    loadProduct()
    function onDocKey(e) {
      if (!product.value) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onDocKey)
    onUnmounted(() => {
      document.removeEventListener('keydown', onDocKey)
    })
  }) 
  watch(() => route.params.id, () => {
    loadProduct()
  })

  // arredonda as estrelas das avaliações
  function starFill(n) {
    const r = (product.value && typeof product.value.rating === 'number') ? product.value.rating : 0;
    const raw = r - (n - 1);
    return Math.max(0, Math.min(1, raw));
  }
  const isFav = computed(() => {
    if (!product.value) return false
    return favorites.isFavorite(product.value.id)
  })
  const inCart = computed(() => {
    if (!product.value) return false
    return Array.isArray(items.value) && items.value.some(i => i.id === product.value.id)
  })
  function toggleFavorite() {
    if (!product.value) return
    const currently = favorites.isFavorite(product.value.id)
    favorites.toggle(product.value.id)
    tempMessage.value = currently ? 'Removido dos favoritos' : 'Adicionado aos favoritos'
    clearTimeout(timer)
    timer = setTimeout(() => { tempMessage.value = null }, 1200)
  }
  function handleCartToggle() {
    if (!product.value) return
    if (inCart.value) {
      cart.remove(product.value.id)
      tempMessage.value = 'Removido do carrinho'
    } else {
      cart.add({
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.image,
        category: product.value.category,
        qty: 1,
      })
      tempMessage.value = 'Adicionado ao carrinho'
    }
    clearTimeout(timer)
    timer = setTimeout(() => { tempMessage.value = null }, 1200)
  }
  function openCartPreview() {
    ui.openCart()
  }
  const relatedProducts = computed(() => {
    if (!product.value) return []
    const cat = product.value.category
    if (!cat) return []
    return PRODUCTS
      .filter(p => p.category === cat && p.id !== product.value.id)
      .slice(0, 4)
  })
  onUnmounted(() => {
    clearTemp()
  })
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .22s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  div::-webkit-scrollbar {
    height: 8px;
  }
  div::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.08);
    border-radius: 999px;
  }
</style>
