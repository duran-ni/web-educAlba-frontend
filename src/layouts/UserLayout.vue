<template>
  <AppHeader variant="user" />
  <main class="app grid-background">
    <RouterView />
  </main>
  <AppFooter variant="reduced" />
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
