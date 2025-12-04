<template>
  <div>
    <!-- anuncio adicionado para leitores de tela -->
    <div class="sr-only" aria-live="polite">
      {{ announceText }}
    </div>
    <!-- skeletons dos produtos -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" aria-busy="true">
      <ProductCardSkeleton v-for="n in skeletonCount" :key="`skeleton-${n}`" />
    </div>
    <!-- quando não tem produtos mostra o empty state -->
    <div v-else-if="!products || products.length === 0" class="py-12 text-center text-neutral-500 dark:text-neutral-400">
      <p class="text-text">Nenhum produto encontrado.</p>
      <p class="text-sm mt-2 text-text">Tente ajustar a busca ou limpar os filtros.</p>
    </div>
    <!-- cards -->
    <transition-group
      v-else
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      role="list"
      enter-active-class="transition duration-300 ease-out"
      leave-active-class="transition duration-200 ease-in"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
      move-class="transition-all duration-300 ease-in-out"
    >
      <div
        v-for="product in products"
        :key="product.id"
        role="listitem"
        tabindex="-1"
        class="w-full"
      >
        <ProductCard :product="product" />
      </div>
    </transition-group>
  </div>
</template>

<script setup>
  import ProductCardSkeleton from "./ProductCardSkeleton.vue";
  import ProductCard from "./ProductCard.vue";
  import { computed } from "vue";
  const props = defineProps({
    products: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    skeletonCountProp: {
      type: Number,
      default: 12
    }
  });
  const skeletonCount = computed(() => {
    return props.skeletonCountProp || 12;
  });
  // texto do anuncio para leitores de tela
  const announceText = computed(() => {
    if (props.isLoading) return "Carregando produtos.";
    const count = Array.isArray(props.products) ? props.products.length : 0;
    return `${count} ${count === 1 ? "produto" : "produtos"} encontrado${count === 1 ? "" : "s"}.`;
  });
</script>
