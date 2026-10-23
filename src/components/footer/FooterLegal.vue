<template>
  <p class="footer-legal">
    © {{ currentYear }} EducAlba. Todos los derechos reservados.
    <RouterLink
      v-if="showPrivacyLink"
      class="footer-legal__link"
      :to="{ name: 'privacy-policy' }"
      >Política de Privacidad</RouterLink
    >
  </p>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  // Oculta el enlace a la política de privacidad en el footer reducido del
  // Dashboard Administrador, donde no tiene sentido mostrarlo
  showPrivacyLink: {
    type: Boolean,
    default: true,
  },
})

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss">
.footer-legal {
  font-size: 1rem;
  color: $color-text-dark;

  &__link {
    margin-left: 0.35rem;
    color: $color-primary;
    font-weight: 600;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }
}
</style>
