<template>
  <nav class="admin-nav" aria-label="Navegación del panel de administración">
    <ul class="admin-nav__list">
      <li v-for="link in links" :key="link.to.name" class="admin-nav__item">
        <RouterLink :to="link.to" class="admin-nav__link" active-class="admin-nav__link--active">
          {{ link.label }}
        </RouterLink>
      </li>
      <li class="admin-nav__item">
        <button type="button" class="admin-nav__link admin-nav__logout" @click="handleLogout">
          Salir
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Los 4 accesos del panel de administrador
const links = [
  { label: 'Inicio', to: { name: 'home' } },
  { label: 'Talleres', to: { name: 'workshops' } },
  { label: 'Refuerzo', to: { name: 'reinforcement' } },
  { label: 'Gestión', to: { name: 'management' } },
]

// Cierra la sesion del administrador y vuelve a la pagina de inicio publica
async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<style lang="scss">
.admin-nav {
  &__list {
    display: flex;
    list-style: none;
    gap: 1.5rem;
  }

  &__link {
    text-decoration: none;
    color: inherit;

    &--active {
      font-weight: 600;
      color: $color-primary;
    }
  }

  &__logout {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
}
</style>
