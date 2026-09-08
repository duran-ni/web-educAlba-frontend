import { createRouter, createWebHistory } from 'vue-router'

// Rutas públicas y protegidas de la aplicación
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Mejora de accesibilidad: al navegar, el foco vuelve al inicio de la página
  scrollBehavior() {
    return { top: 0 }
  },
})

// Guard de navegación: protege las rutas marcadas con "meta.requiresAuth"
// TODO: sustituir el placeholder por la comprobación real del useAuthStore
// cuando se implemente la Historia de Login
router.beforeEach((to) => {
  const isAuthenticated = false // placeholder temporal

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
