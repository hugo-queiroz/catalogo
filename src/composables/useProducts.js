import { ref, computed, watch, onUnmounted } from 'vue'
import debounce from '@/utils/debounce'
const MIN_DELAY = 200
const MAX_DELAY = 500

const simulateLatency = () =>
  new Promise((res) =>
    setTimeout(res, Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY))
  )
export function useProducts() {
  const allProducts = ref([])
  const filteredProducts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchTerm = ref('')
  const categoryFilter = ref(null)
  const priceRange = ref([0, 99999])
  const currentPage = ref(1)
  const pageSize = 12
  let abortController = null
  
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    if (abortController) abortController.abort()
    abortController = new AbortController()
    try {
      await simulateLatency()
      const res = await fetch('/products.json', {
        signal: abortController.signal,
      })
      if (!res.ok) throw new Error('Falha ao carregar produtos')
      const data = await res.json()
      allProducts.value = data
    } catch (err) {
      if (err.name === 'AbortError') return
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // retry
  const retry = () => fetchProducts()
  // busca com debounce
  const runFilter = () => {
    let temp = [...allProducts.value]
    // filtro por busca
    if (searchTerm.value.trim()) {
      const term = searchTerm.value.toLowerCase()
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(term)
      )
    }
    // categoria
    if (categoryFilter.value) {
      temp = temp.filter((p) => p.category === categoryFilter.value)
    }
    // preço
    temp = temp.filter(
      (p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]
    )
    filteredProducts.value = temp
    currentPage.value = 1 // reset da paginação quando filtrar
  }
  const debouncedFilter = debounce(runFilter, 300)
  // watchers
  watch([searchTerm, categoryFilter, priceRange], () => {
    debouncedFilter()
  })
  onUnmounted(() => {
    if (abortController) abortController.abort()
    debouncedFilter.cancel()
  })
  // paginação
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredProducts.value.slice(start, start + pageSize)
  })
  const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / pageSize)
  )
  const hasFilters = computed(() => {
    return (
      searchTerm.value.trim() ||
      categoryFilter.value ||
      priceRange.value[0] !== 0 ||
      priceRange.value[1] !== 99999
    )
  })
  // iniciar
  fetchProducts()
  return {
    // state
    loading,
    error,
    allProducts,
    filteredProducts,
    // filtros
    searchTerm,
    categoryFilter,
    priceRange,
    hasFilters,
    // paginação
    paginatedProducts,
    currentPage,
    totalPages,
    // ações
    retry,
  }
}