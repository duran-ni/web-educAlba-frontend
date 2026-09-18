<template>
  <p class="footer-legal">© {{ currentYear }} EducAlba. Todos los derechos reservados.</p>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss">
.footer-legal {
  font-size: 0.875rem;
  color: $color-text-dark;
}
</style>
