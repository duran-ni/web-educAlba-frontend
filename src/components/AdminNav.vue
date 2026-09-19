<template>
  <nav class="admin-nav" aria-label="Navegación del panel de administración">
    <ul class="admin-nav__list">
      <li v-for="link in links" :key="link.to.name" class="admin-nav__item">
        <RouterLink
          :to="link.to"
          class="admin-nav__link"
          active-class="admin-nav__link--active"
        >
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// Los 4 accesos del panel de administrador
const links = [
  { label: 'Inicio', to: { name: 'home' } },
  { label: 'Talleres', to: { name: 'workshops' } },
  { label: 'Refuerzo', to: { name: 'reinforcement' } },
  { label: 'Gestión', to: { name: 'management' } },
]
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
}
</style>
