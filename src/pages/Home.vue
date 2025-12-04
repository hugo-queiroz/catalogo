<template>
  <div>
    <!-- hero -->
    <AppHero />

    <section class="flex gap-6 mt-10">
      <!-- filtros (mudam conforme tamanho de tela) -->
      <Filters
        :selected-categories="selectedCategories"
        :price-min="priceMin"
        :price-max="priceMax"
        :categories="categories"
        :open="drawerOpen"
        :min-boundary="bounds.min"
        :max-boundary="bounds.max"
        @update:selectedCategories="selectedCategories = $event"
        @update:priceMin="priceMin = $event"
        @update:priceMax="priceMax = $event"
        @reset="resetFilters"
        @close="drawerOpen = false"
      />
      <!-- conteúdo -->
      <div class="flex-1">
        <!-- mobile -->
        <div class="flex items-center justify-between mb-4 xl:hidden">
          <h2 class="text-xl font-semibold text-primary">
            Produtos
          </h2>
          <button
            @click="drawerOpen = true"
            class="flex items-center gap-2 bg-primary text-base hover:bg-primary/80 px-3 py-2 rounded-lg text-sm"
          >
            Filtros
          </button>
        </div>
        <!-- input de busca -->
        <div class="mb-4">
          <input
            type="text"
            placeholder="Buscar produtos..."
            v-model="search"
            class="w-full p-2 border rounded-lg border-border bg-base"
            aria-label="Buscar produtos"
          />
        </div>
        <!-- desk -->
        <h2 class="text-xl font-semibold mb-4 hidden xl:block text-text">
          Produtos
        </h2>
        <!-- grid de produtos -->
        <ProductGrid
          :products="pagedProducts"
          :isLoading="loading"
        />
        <!-- paginacao -->
        <div
          class="flex items-center justify-center gap-3 mt-6"
          v-if="!loading && filteredProducts.length > 0"
        >
          <button
            @click="page > 1 && (page--)"
            :disabled="page === 1"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span class="text-sm">
            Página {{ page }} de {{ totalPages }}
          </span>
          <button
            @click="page < totalPages && (page++)"
            :disabled="page === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
  import AppHero from "@/layouts/Hero.vue";
  import Filters from "@/components/Filters.vue";
  import ProductGrid from "@/components/ProductGrid.vue";
  import PRODUCTS from "@/data/products.json";
  
  const drawerOpen = ref(false);
  /* pesquisa com debounce */
  const search = ref("");
  let debounceTimer = null;
  /* filtros */
  const selectedCategories = ref([]);
  const priceMin = ref(0);
  const priceMax = ref(2000);
  const categories = ref(["Eletrônicos", "Vestuário", "Acessórios", "Calçados"]);
  const bounds = ref({
    min: 0,
    max: 2000,
  });
  function resetFilters() {
    selectedCategories.value = [];
    priceMin.value = bounds.value.min;
    priceMax.value = bounds.value.max;
  }
  const products = ref([]);
  const loading = ref(true);
  /* suporte pra paginação */
  const page = ref(1);
  const perPage = ref(12);
  /* simula a latencia */
  function simulateLoad(delay = 400) {
    return new Promise((res) => setTimeout(res, delay));
  }
  /* carrega produtos */
  onMounted(async () => {
    loading.value = true;
    await simulateLoad(400);
    products.value = Array.isArray(PRODUCTS) ? PRODUCTS : [];
    const cats = Array.from(new Set(products.value.map(p => p.category)));
    if (cats.length > 0) categories.value = cats;
    const prices = products.value.map(p => Number(p.price || 0));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    bounds.value.min = Math.floor(min);
    bounds.value.max = Math.ceil(max);
    priceMin.value = bounds.value.min;
    priceMax.value = bounds.value.max;
    loading.value = false;
  });
  onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });
  watch(search, () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      page.value = 1;
    }, 300);
  });
  /* filtragem */
  const filteredProducts = computed(() => {
    let list = [...products.value];
    if (selectedCategories.value.length > 0) {
      list = list.filter((p) => selectedCategories.value.includes(p.category));
    }
    const min = Number(priceMin.value);
    const max = Number(priceMax.value);
    list = list.filter((p) => {
      const price = Number(p.price);
      return price >= min && price <= max;
    });
    const q = search.value.trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter((p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    return list;
  });
  /* paginacao */
  const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage.value)
  );
  const pagedProducts = computed(() => {
    const start = (page.value - 1) * perPage.value;
    return filteredProducts.value.slice(start, start + perPage.value);
  });
</script>
