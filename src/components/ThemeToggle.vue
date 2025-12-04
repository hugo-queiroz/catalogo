<template>
  <button
    @click="toggleTheme"
    class="w-9 h-9 rounded-full flex items-center justify-center bg-surface hover:opacity-90 transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    type="button"
    :aria-pressed="theme === 'dark'"
    :aria-label="theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'"
    :title="theme === 'dark' ? 'Modo escuro' : 'Modo claro'"
  >
    <span class="text-lg">{{ theme === 'dark' ? '🌙' : '☀️' }}</span>
  </button>
</template>

<script setup>
  import { useThemeStore } from '@/store/theme'
  import { storeToRefs } from 'pinia'
  const themeStore = useThemeStore()
  const { theme } = storeToRefs(themeStore)
  function toggleTheme() {
    themeStore.setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }
</script>
