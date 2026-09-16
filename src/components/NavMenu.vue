<template>
  <nav class="nav-menu">
    <ul class="nav-menu__list">
      <li v-for="link in links" :key="link.to.name" class="nav-menu__item">
        <RouterLink
          :to="link.to"
          class="nav-menu__link"
          active-class="nav-menu__link--active"
        >
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

// Los 6 enlaces principales de navegación pública, en el orden que pide la historia
const links = [
  { label: 'Inicio', to: { name: 'home' } },
  { label: 'Talleres', to: { name: 'workshops' } },
  { label: 'Refuerzo', to: { name: 'reinforcement' } },
  { label: 'Quiénes Somos', to: { name: 'about' } },
  { label: 'Qué Hacemos', to: { name: 'what-we-do' } },
  { label: 'Galería', to: { name: 'gallery' } },
]
</script>

<style lang="scss">
.nav-menu {
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
