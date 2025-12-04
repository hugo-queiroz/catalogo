<template>
  <header class="w-full sticky top-0 z-40 bg-surface border-b border-border">
    <div class="container mx-auto px-4 py-3 flex items-center gap-4 justify-between">
      <router-link to="/">
        <h1 class="text-lg font-bold text-text-primary">Catálogo da SIEG</h1>
      </router-link>
      <div class="flex gap-4">
        <!-- alterna o tema -->
        <ThemeToggle />
        <!-- botão do carrinho -->
        <MiniCartButton />
      </div>
    </div>
  </header>
</template>

<script setup>
  import ThemeToggle from './ThemeToggle.vue'
  import MiniCartButton from './MiniCartButton.vue'
</script>