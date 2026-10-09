<template>
  <RouterLink :to="dashboardRoute" class="dashboard-button">
    {{ dashboardLabel }}
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/config/roles'

const authStore = useAuthStore()

// Lleva de vuelta al panel que corresponde segun el rol de quien ha iniciado
// sesion, para no perder el acceso a su area al navegar por las vistas
// publicas (Talleres, Refuerzo...)
const isAdmin = computed(() => authStore.user?.roles.includes(ROLES.ADMIN))

const dashboardRoute = computed(() => (isAdmin.value ? { name: 'admin' } : { name: 'dashboard' }))
const dashboardLabel = computed(() => (isAdmin.value ? 'Dashboard Admin' : 'Mi Dashboard'))
</script>

<style lang="scss">
.dashboard-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  background-color: $color-primary;
  color: $color-background;
  font-family: $font-body;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover,
  &:focus-visible {
    filter: brightness(0.9);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-yellow;
    outline-offset: 2px;
  }
}
</style>
