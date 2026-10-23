<template>
  <footer class="app-footer" :class="{ 'app-footer--reduced': variant === 'reduced' }">
    <template v-if="variant === 'full'">
      <div class="app-footer__brand">
        <AppLogo />
        <FooterLegal :show-privacy-link="showPrivacyLink" />
      </div>
      <FooterContact />
      <FooterSocial />
    </template>

    <FooterLegal v-else :show-privacy-link="showPrivacyLink" />
  </footer>
</template>

<script setup>
import AppLogo from '../AppLogo.vue'
import FooterContact from './FooterContact.vue'
import FooterSocial from './FooterSocial.vue'
import FooterLegal from './FooterLegal.vue'

defineProps({
  variant: {
    type: String,
    default: 'full',
  },
  // Se desactiva desde el Dashboard Administrador, donde el enlace a la
  // política de privacidad no tiene sentido (es un documento pensado para
  // las familias que se registran, no para el equipo de la academia)
  showPrivacyLink: {
    type: Boolean,
    default: true,
  },
})
</script>

<style lang="scss">
.app-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  background-color: $color-background-alt;
  border-top: 4px double $color-primary;

  @include respond-to(tablet) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &--reduced {
    @include respond-to(tablet) {
      justify-content: center;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    @include respond-to (tablet) {
      align-items: flex-start;
    }
  }
}
</style>
