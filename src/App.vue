<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
const isLoginView = computed(() => route.name === 'login')
</script>

<template>
  <AppHeader :variant="isLoginView ? 'reduced' : 'full'" />
  <main class="app">
    <RouterView />
  </main>
  <AppFooter :variant="isLoginView ? 'reduced' : 'full'" />
</template>

<style lang="scss">
.app {
  min-height: 100vh;
}
</style>

