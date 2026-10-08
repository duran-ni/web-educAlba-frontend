<template>
  <RouterLink :to="{ name: 'register' }" class="register-button">
    Registrarse
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style lang="scss">
.register-button {
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
