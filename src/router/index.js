import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import ProductPage from '../pages/ProductPage.vue'

// rotas
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/produto/:id', name: 'Product', component: ProductPage, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
