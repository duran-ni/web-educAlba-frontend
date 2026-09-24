import { createRouter, createWebHistory } from 'vue-router'

// Rutas de la aplicación, agrupadas por layout: cada área (pública, autenticación,
// usuario, administrador) anida sus vistas dentro del layout que le corresponde,
// en vez de calcular a mano la variante de cabecera/pie de página en App.vue.
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      { path: 'talleres', name: 'workshops', component: () => import('@/views/WorkshopsView.vue') },
      { path: 'refuerzo', name: 'reinforcement', component: () => import('@/views/ReinforcementView.vue') },
      { path: 'quienes-somos', name: 'about', component: () => import('@/views/AboutView.vue') },
      { path: 'que-hacemos', name: 'what-we-do', component: () => import('@/views/WhatWeDoView.vue') },
      { path: 'galeria', name: 'gallery', component: () => import('@/views/GalleryView.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('@/views/LoginView.vue') },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('@/views/UserDashboardView.vue') },
      { path: 'mis-talleres', name: 'my-workshops', component: () => import('@/views/MyWorkshopsView.vue') },
      { path: 'mi-perfil', name: 'my-profile', component: () => import('@/views/MyProfileView.vue') },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin', component: () => import('@/views/AdminDashboardView.vue') },
      { path: 'gestion', name: 'management', component: () => import('@/views/ManagementView.vue') },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
    ],
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
