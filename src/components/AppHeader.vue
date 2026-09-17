<template>
  <header class="app-header grid-background">
    <RouterLink :to="{ name: 'home' }" class="app-header__logo-link">
      <AppLogo />
    </RouterLink>
    <NavMenu />
    <LoginButton />
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import AppLogo from './AppLogo.vue'
import NavMenu from './NavMenu.vue'
import LoginButton from './LoginButton.vue'
</script>

<style lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;

  &__logo-link {
    display: inline-flex;
    text-decoration: none;
  }
}
</style>
