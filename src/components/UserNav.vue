<template>
  <nav class="user-nav" aria-label="Navegación del área privada">
    <ul id="user-nav-list" class="user-nav__list" :class="{ 'user-nav__list--open': isOpen }">
      <li v-for="link in links" :key="link.to.name" class="user-nav__item">
        <RouterLink
          :to="link.to"
          class="user-nav__link"
          active-class="user-nav__link--active"
          @click="$emit('navigate')"
        >
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['navigate'])

// Opciones de ejemplo del área privada del alumno/familia.
// Pendiente de confirmar con el cliente el listado definitivo — "Salir" es la única fija.
const links = [
  { label: 'Inicio', to: { name: 'dashboard' } },
  { label: 'Mis Talleres', to: { name: 'my-workshops' } },
  { label: 'Mi Perfil', to: { name: 'my-profile' } },
  // "Salir" navega de momento a Inicio; el cierre de sesión real llega con la historia de Logout
  { label: 'Salir', to: { name: 'home' } },
]
</script>

<style lang="scss">
.user-nav {
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

    &--open {
      display: flex;
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
}
</style>
