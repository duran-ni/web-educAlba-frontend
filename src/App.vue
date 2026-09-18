<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <main class="app">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style lang="scss">
.app {
  min-height: 100vh;
}
</style>

