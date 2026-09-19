<template>
  <header
    class="app-header grid-background"
    :class="{ 'app-header--reduced': variant === 'reduced' }"
  >
    <RouterLink :to="{ name: 'home' }" class="app-header__logo-link">
      <AppLogo />
    </RouterLink>

    <template v-if="variant === 'full'">
      <NavMenu :is-open="isMenuOpen" @navigate="closeMenu" />

      <div class="app-header__actions">
        <LoginButton />
        <NavToggle :is-open="isMenuOpen" @toggle="toggleMenu" />
      </div>
    </template>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLogo from './AppLogo.vue'
import NavMenu from './NavMenu.vue'
import LoginButton from './LoginButton.vue'
import NavToggle from './NavToggle.vue'

defineProps({
  variant: {
    type: String,
    default: 'full',
  },
})

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<style lang="scss">
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  &--reduced {
    justify-content: center;
  }

  &__logo-link {
    display: inline-flex;
    text-decoration: none;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
