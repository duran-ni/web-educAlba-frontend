<template>
  <nav class="nav-menu">
    <ul
      id="main-nav"
      class="nav-menu__list"
      :class="{ 'nav-menu__list--open': isOpen }"
    >
      <li v-for="link in links" :key="link.to.name" class="nav-menu__item">
        <RouterLink
          :to="link.to"
          class="nav-menu__link"
          active-class="nav-menu__link--active"
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
}
</style>
