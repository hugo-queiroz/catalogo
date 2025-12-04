import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// toda lógica referente ao tema
function disableThemeTransitionsTemporarily() {
  const el = document.documentElement
  el.classList.add('disable-theme-transitions')
  void el.offsetWidth
  requestAnimationFrame(() => {
    setTimeout(() => {
    el.classList.remove('disable-theme-transitions')
    }, 40)
  })
}

export const useThemeStore = defineStore('theme', () => {
  const initial = (() => {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch (e) {}
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
})()

const theme = ref(initial)

const setTheme = (t) => {
  if (!t || (t !== 'dark' && t !== 'light')) return
  disableThemeTransitionsTemporarily()
  theme.value = t
}

watch(theme, (v) => {
  try {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
    try { localStorage.setItem('theme', v) } catch {}
  })
} else {
  setTimeout(() => { try { localStorage.setItem('theme', v) } catch {} }, 0)
}
} catch (e) {}

if (v === 'dark') document.documentElement.classList.add('dark')
else document.documentElement.classList.remove('dark')
}, { immediate: true })

return { theme, setTheme }
})