<template>
  <div class="relative">
    <!-- botao para favoritar -->
    <button
      @click.stop="handleFavorite"
      class="absolute top-3 right-3 z-20 bg-base rounded-full p-2 shadow hover:scale-110 transition"
      type="button"
      :aria-pressed="favorites.isFavorite(product.id)"
      aria-label="Favoritar produto"
    >
      <!-- icone de favorito -->
      <svg
        v-if="favorites.isFavorite(product.id)"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18l-6.828-6.828a4 4 0 010-5.656z"
        />
      </svg>
      <!-- icone de não favorito -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-neutral-500 dark:text-neutral-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
    </button>
    <!-- feedback ao favoritar -->
    <transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="tempMessage" class="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-xl px-4" aria-live="polite" >
        <span class="text-white font-semibold text-lg">{{ tempMessage }}</span>
      </div>
    </transition>

    <!-- card -->
    <router-link
      :to="`/produto/${product.id}`"
      class="block bg-base rounded-xl border border-border overflow-hidden hover:shadow-md transition transform cursor-pointer"
    >
      <!-- imagem -->
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <!-- nome do produto -->
        <h3 class="text-lg font-semibold text-text">
          {{ product.name }}
        </h3>
        <!-- categoria do produto -->
        <p class="text-sm text-text/60 mt-1">
          {{ product.category }}
        </p>
        <!-- preço do produto -->
        <p class="text-lg font-bold text-text mt-2">
          R$ {{ product.price.toFixed(2) }}
        </p>

        <!-- avaliacao do produto -->
        <div class="flex items-baseline mt-2">
          <div class="flex items-center" aria-label="Avaliação do produto">
            <span v-for="n in 5" :key="n" class="inline-block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 inline-block text-neutral-200 dark:text-neutral-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.044 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.285-3.96z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 inline-block -ml-4 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <defs>
                  <clipPath :id="`clip-${product.id}-${n}`">
                    <rect :width="(starFill(n) * 100) + '%'" height="100%" />
                  </clipPath>
                </defs>
                <g :clip-path="`url(#clip-${product.id}-${n})`">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.96c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.285-3.96a1 1 0 00-.364-1.118L2.044 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.285-3.96z"
                  />
                </g>
              </svg>
            </span>
          </div>
          <span class="text-xs text-neutral-500 ml-1">
            ({{ product.reviews || 0 }})
          </span>
        </div>
        <!-- botao de adicionar/remover do carrinho -->
        <button
          class="w-full mt-4 px-3 py-3 rounded-lg font-semibold transition-all duration-300 transform"
          :class="inCart
            ? 'bg-[#ddd] text-black hover:bg-[#ccc]'
            : 'bg-primary text-white hover:bg-primary-dark'
          "
          @click.prevent.stop="handleAddToCart"
        >
          {{ inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho' }}
        </button>
      </div>
    </router-link>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { storeToRefs } from "pinia";
  import { useFavoritesStore } from "@/store/favorites";
  import { useCartStore } from "@/store/cart";

  const props = defineProps({
    product: { type: Object, required: true },
  });
  const favorites = useFavoritesStore();
  const cart = useCartStore();
  const { items } = storeToRefs(cart);
  const tempMessage = ref(null);
  let timer = null;
  function starFill(n) {
    const rating = Number(props.product.rating) || 0;
    return Math.max(0, Math.min(1, rating - (n - 1)));
  }
  const inCart = computed(() =>
    items.value?.some((i) => i.id === props.product.id)
  );
  // funcao para favoritar/desfavoritar produto
  function handleFavorite() {
    const wasFav = favorites.isFavorite(props.product.id);
    favorites.toggle(props.product.id);
    tempMessage.value = wasFav ? "Removido dos favoritos" : "Adicionado aos favoritos";
    clearTimeout(timer);
    timer = setTimeout(() => (tempMessage.value = null), 1200);
  }
  // funcao para adicionar/remover do carrinho
  function handleAddToCart() {
    if (inCart.value) {
      cart.remove(props.product.id);
      tempMessage.value = "Removido do carrinho";
    } else {
      cart.add({ ...props.product, qty: 1 });
      tempMessage.value = "Adicionado ao carrinho";
    }

    clearTimeout(timer);
    timer = setTimeout(() => (tempMessage.value = null), 1200);
  }
</script>