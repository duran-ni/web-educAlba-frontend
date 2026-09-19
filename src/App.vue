<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()

// Rutas del panel de administración
const ADMIN_ROUTE_NAMES = ['admin', 'management']
// Rutas del área privada del alumno/familia
const USER_ROUTE_NAMES = ['dashboard', 'my-workshops', 'my-profile']

const headerVariant = computed(() => {
  if (route.name === 'login') return 'reduced'
  if (ADMIN_ROUTE_NAMES.includes(route.name)) return 'admin'
  if (USER_ROUTE_NAMES.includes(route.name)) return 'user'
  return 'full'
})

// El pie de página no tiene variantes propias para admin/user: en cualquier
// vista que no sea pública usamos su versión reducida (solo el aviso legal)
const footerVariant = computed(() => (headerVariant.value === 'full' ? 'full' : 'reduced'))
</script>

<template>
  <AppHeader :variant="headerVariant" />
  <main class="app">
    <RouterView />
  </main>
  <AppFooter :variant="footerVariant" />
</template>

<style lang="scss">
.app {
  min-height: 100vh;
}
</style>
