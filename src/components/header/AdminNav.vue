<template>
  <nav class="admin-nav" aria-label="Navegación del panel de administración">
    <ul id="admin-nav-list" class="admin-nav__list" :class="{ 'admin-nav__list--open': isOpen }">
      <li v-for="link in links" :key="link.to.name" class="admin-nav__item">
        <RouterLink
          :to="link.to"
          class="admin-nav__link"
          active-class="admin-nav__link--active"
          @click="$emit('navigate')"
        >
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

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const router = useRouter()
const authStore = useAuthStore()

// Los accesos del panel de administrador
const links = [
  { label: 'Inicio', to: { name: 'home' } },
  { label: 'Dashboard', to: { name: 'admin' } },
  { label: 'Refuerzo', to: { name: 'reinforcement' } },
  { label: 'Talleres', to: { name: 'workshops' } },
  { label: 'Alumnos', to: { name: 'students' } },
  { label: 'Galería', to: { name: 'admin-gallery' } },
]

// Cierra el menu movil, cierra la sesion del administrador y vuelve a la pagina de inicio publica
async function handleLogout() {
  emit('navigate')
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<style lang="scss">
.admin-nav {
  &__list {
    display: none;
    flex-direction: column;
    list-style: none;
    gap: 1rem;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 1rem 1.5rem;
    background-color: $color-background;
    z-index: 10;

    &--open {
      display: flex;
    }

    @include respond-to(tablet) {
      display: flex;
      flex-direction: row;
      position: static;
      gap: 1.5rem;
      padding: 0;
      background-color: transparent;
    }
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
