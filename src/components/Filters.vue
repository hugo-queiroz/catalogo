<template>
  <aside
    :class="[
      'bg-surface p-4 rounded-lg transition-all border border-border text-text',
      open ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
      open ? 'h-screen overflow-y-auto' : 'h-auto',
      'fixed xl:static left-0 z-40 xl:z-auto w-72 xl:w-64',
      'top-16',
      'xl:sticky xl:top-20 xl:h-max'
    ]"
    aria-label="Filtros de produtos"
  >
    <!-- titulo -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-primary">Filtros</h3>
      <button class="xl:hidden text-sm underline text-primary" @click="$emit('close')">
        Fechar
      </button>
    </div>

    <!-- categorias -->
    <div class="mb-6">
      <p class="block mb-2 font-medium text-text">Categorias</p>
      <div class="flex flex-col gap-2">
        <label
          v-for="c in categories"
          :key="c"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            :value="c"
            :checked="localSelectedCategories.includes(c)"
            @change="onCategoryToggle($event, c)"
            class="rounded border-border text-primary focus:ring-primary"
          />
          <span class="text-text">{{ c }}</span>
        </label>
      </div>
    </div>

    <!-- faixa de preço -->
    <div class="mb-6">
      <p class="block mb-2 font-medium text-text">Faixa de preço</p>

      <!-- inputs -->
      <div class="flex items-center gap-3 mb-4">
        <input
          type="number"
          v-model.number="localPriceMin"
          :min="minBoundary"
          :max="maxBoundary"
          @blur="validateMin"
          class="w-full p-2 border border-border rounded-lg bg-base text-text"
          aria-label="Preço mínimo"
        />
        <span class="text-text">—</span>
        <input
          type="number"
          v-model.number="localPriceMax"
          :min="minBoundary"
          :max="maxBoundary"
          @blur="validateMax"
          class="w-full p-2 border border-border rounded-lg bg-base text-text"
          aria-label="Preço máximo"
        />
      </div>

      <!-- slider -->
      <div class="relative h-10 mb-2 overflow-hidden" ref="sliderRef">
        <div class="absolute left-0 right-0 top-4 h-1 rounded bg-border"></div>
        <div class="absolute top-4 h-1 rounded bg-primary" :style="selectedRangeStyle"></div>

        <input
          ref="rangeMin"
          type="range"
          :min="minBoundary"
          :max="maxBoundary"
          step="1"
          v-model.number="localPriceMin"
          class="absolute left-0 top-0 w-full h-10 appearance-none bg-transparent"
          style="pointer-events: none;"
        />

        <input
          ref="rangeMax"
          type="range"
          :min="minBoundary"
          :max="maxBoundary"
          step="1"
          v-model.number="localPriceMax"
          class="absolute left-0 top-0 w-full h-10 appearance-none bg-transparent"
          style="pointer-events: none;"
        />

        <div
          class="absolute left-0 top-0 w-full h-10"
          @pointerdown.prevent="onOverlayPointerDown"
        ></div>
      </div>

      <p class="text-sm mt-2 text-text">
        R$ {{ localPriceMin }} — R$ {{ localPriceMax }}
      </p>
    </div>

    <!-- contador -->
    <div class="mb-4 text-sm text-text">
      <span class="font-medium">Filtros ativos:</span> {{ activeFilters }}
    </div>

    <!-- reset -->
    <button
      @click="resetLocal"
      class="mt-4 bg-primary px-4 py-2 rounded w-full font-medium text-base"
    >
      Limpar Filtros
    </button>
  </aside>
</template>

<script setup>
  import { ref, computed, watch, onBeforeUnmount } from "vue";

  const props = defineProps({
    selectedCategories: Array,
    priceMax: Number,
    priceMin: Number,
    categories: Array,
    open: Boolean,
    minBoundary: Number,
    maxBoundary: Number
  });
  const emit = defineEmits([
    "update:selectedCategories",
    "update:priceMin",
    "update:priceMax",
    "reset",
    "close"
  ]);

  const localSelectedCategories = ref([...props.selectedCategories]);
  const localPriceMin = ref(props.priceMin ?? props.minBoundary);
  const localPriceMax = ref(props.priceMax ?? props.maxBoundary);
  const sliderRef = ref(null);
  const rangeMin = ref(null);
  const rangeMax = ref(null);
  watch(
    () => props.selectedCategories,
    v => {
      localSelectedCategories.value = [...v];
    }
  );
  watch(
    () => props.priceMin,
    v => {
      if (typeof v === "number") localPriceMin.value = v;
    }
  );
  watch(
    () => props.priceMax,
    v => {
      if (typeof v === "number") localPriceMax.value = v;
    }
  );
  function onCategoryToggle(e, cat) {
    const checked = e.target.checked;
    const set = new Set(localSelectedCategories.value);
    checked ? set.add(cat) : set.delete(cat);
    localSelectedCategories.value = [...set];
    emit("update:selectedCategories", localSelectedCategories.value);
  }
  let isDragging = false;
  const activeThumb = ref(null);
  function clamp(v, a, b) {
    return Math.min(Math.max(v, a), b);
  }
  function valueFromPointerEvent(e) {
    const rect = sliderRef.value.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const px = clamp(clientX - rect.left, 0, rect.width);
    const ratio = rect.width === 0 ? 0 : px / rect.width;
    const raw = props.minBoundary + ratio * (props.maxBoundary - props.minBoundary);
    return Math.round(raw);
  }
  function thumbPositionInPx(value) {
    const rect = sliderRef.value.getBoundingClientRect();
    const range = props.maxBoundary - props.minBoundary || 1;
    const ratio = (value - props.minBoundary) / range;
    return rect.left + ratio * rect.width;
  }
  function onOverlayPointerDown(e) {
    const valAtPointer = valueFromPointerEvent(e);
    const rect = sliderRef.value.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const minPx = thumbPositionInPx(localPriceMin.value);
    const maxPx = thumbPositionInPx(localPriceMax.value);
    const distMin = Math.abs(clientX - minPx);
    const distMax = Math.abs(clientX - maxPx);
    activeThumb.value = distMin <= distMax ? "min" : "max";
    isDragging = true;
    setValueForActive(valAtPointer);
    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);
    window.addEventListener("pointercancel", onWindowPointerUp);
  }
  function onWindowPointerMove(e) {
    if (!isDragging) return;
    const val = valueFromPointerEvent(e);
    setValueForActive(val);
  }
  function onWindowPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    activeThumb.value = null;
    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
  }
  function setValueForActive(rawVal) {
    const v = clamp(Math.round(rawVal), props.minBoundary, props.maxBoundary);
    if (activeThumb.value === "min") {
      const newMin = Math.min(v, localPriceMax.value);
      localPriceMin.value = newMin;
      emit("update:priceMin", localPriceMin.value);
    } else if (activeThumb.value === "max") {
      const newMax = Math.max(v, localPriceMin.value);
      localPriceMax.value = newMax;
      emit("update:priceMax", localPriceMax.value);
    }
  }
  function validateMin() {
    let v = localPriceMin.value;
    if (v == null || Number.isNaN(v)) v = props.minBoundary;
    if (v < props.minBoundary) v = props.minBoundary;
    if (v > localPriceMax.value) v = localPriceMax.value;
    localPriceMin.value = v;
    emit("update:priceMin", v);
  }
  function validateMax() {
    let v = localPriceMax.value;
    if (v == null || Number.isNaN(v)) v = props.maxBoundary;
    if (v > props.maxBoundary) v = props.maxBoundary;
    if (v < localPriceMin.value) v = localPriceMin.value;
    localPriceMax.value = v;
    emit("update:priceMax", v);
  }
  const selectedRangeStyle = computed(() => {
    const min = props.minBoundary;
    const max = props.maxBoundary;
    const left = ((localPriceMin.value - min) / (max - min)) * 100;
    const right = ((localPriceMax.value - min) / (max - min)) * 100;
    return { left: `${left}%`, width: `${right - left}%` };
  });
  const activeFilters = computed(() => {
    let c = 0;
    if (localSelectedCategories.value.length) c += localSelectedCategories.value.length;
    if (localPriceMin.value !== props.minBoundary) c++;
    if (localPriceMax.value !== props.maxBoundary) c++;
    return c;
  });
  function resetLocal() {
    localSelectedCategories.value = [];
    localPriceMin.value = props.minBoundary;
    localPriceMax.value = props.maxBoundary;
    emit("update:selectedCategories", []);
    emit("update:priceMin", localPriceMin.value);
    emit("update:priceMax", localPriceMax.value);
    emit("reset");
  }
  onBeforeUnmount(() => {
    window.removeEventListener("pointermove", onWindowPointerMove);
    window.removeEventListener("pointerup", onWindowPointerUp);
    window.removeEventListener("pointercancel", onWindowPointerUp);
  });
</script>
