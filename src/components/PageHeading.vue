<template>
  <header class="page-heading">
    <h1 class="page-heading__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-heading__subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup>
defineProps({
  // Título principal de la vista
  title: {
    type: String,
    required: true,
  },
  // Subtítulo introductorio, opcional
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss">
.page-heading {
  margin-bottom: 1.5rem;

  &__title {
    margin: 0;
    font-size: 2rem;
  }

  &__subtitle {
    margin: 0.5rem 0 0;
    font-size: 1.125rem;
    color: $color-text-dark;
  }
}
</style>
