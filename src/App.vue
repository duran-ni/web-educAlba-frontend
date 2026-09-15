<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="app">
    <RouterView />
  </main>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
}
</style>

