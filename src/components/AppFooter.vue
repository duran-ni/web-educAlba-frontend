<template>
  <footer class="app-footer" :class="{ 'app-footer--reduced': variant === 'reduced' }">
    <template v-if="variant === 'full'">
      <div class="app-footer__brand">
        <AppLogo />
        <FooterLegal />
      </div>
      <FooterContact />
      <FooterSocial />
    </template>

    <FooterLegal v-else />
  </footer>
</template>

<script setup>
import AppLogo from './AppLogo.vue'
import FooterContact from './FooterContact.vue'
import FooterSocial from './FooterSocial.vue'
import FooterLegal from './FooterLegal.vue'

defineProps({
  variant: {
    type: String,
    default: 'full',
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
    flex-direction: colum;
    align-items: center;
    gap: 0.5rem;

    @include respond-to (tablet) {
      align-items: flex-start;
    }
  }
}
</style>
