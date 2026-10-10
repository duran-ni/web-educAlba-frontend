import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

// Rutas de la aplicación, agrupadas por layout: cada área (pública, autenticación,
// usuario, administrador) anida sus vistas dentro del layout que le corresponde,
// en vez de calcular a mano la variante de cabecera/pie de página en App.vue.
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/public/HomeView.vue') },
      {
        path: 'talleres',
        name: 'workshops',
        component: () => import('@/views/public/WorkshopsView.vue'),
      },
      {
        path: 'refuerzo',
        name: 'reinforcement',
        component: () => import('@/views/public/ReinforcementView.vue'),
      },
      {
        path: 'quienes-somos',
        name: 'about',
        component: () => import('@/views/public/AboutView.vue'),
      },
      {
        path: 'que-hacemos',
        name: 'what-we-do',
        component: () => import('@/views/public/WhatWeDoView.vue'),
      },
      {
        path: 'galeria',
        name: 'gallery',
        component: () => import('@/views/public/GalleryView.vue'),
      },
      {
        path: 'contacto',
        name: 'contact',
        component: () => import('@/views/public/ContactView.vue'),
      },
      { path: 'login', name: 'login', component: () => import('@/views/auth/LoginView.vue') },
      {
        path: '/registro',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
      },
      {
        path: '/recuperar-contrasena',
        name: 'forgot-password',
        component: () => import('@/views/auth/ForgotPasswordView.vue'),
      },
      {
        path: '/restablecer-contrasena',
        name: 'reset-password',
        component: () => import('@/views/auth/ResetPasswordView.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/user/UserDashboardView.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin', component: () => import('@/views/admin/AdminDashboardView.vue') },
      {
        path: 'alumnos',
        name: 'students',
        component: () => import('@/views/admin/AdminStudentsView.vue'),
      },
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
// comprobando si hay un usuario autenticado en la store. La comprobacion de
// sesion activa al recargar la pagina (via /api/auth/me) llega con la
// Historia de Cerrar sesion
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
