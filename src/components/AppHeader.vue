<template>
  <header class="app-header grid-background">
    <RouterLink :to="{ name: 'home' }" class="app-header__logo-link">
      <AppLogo />
    </RouterLink>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import AppLogo from './AppLogo.vue'
</script>

<style lang="scss">
.app-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;

  &__logo-link {
    display: inline-flex;
    text-decoration: none;
  }
}
</style>
