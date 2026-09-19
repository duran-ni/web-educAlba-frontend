<template>
  <footer class="app-footer" :class="{ 'app-footer--reduced': variant === 'reduced' }">
    <template v-if="variant === 'full'">
      <FooterContact />
      <FooterSocial />
    </template>
    <FooterLegal />
  </footer>
</template>

<script setup>
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
    align-items: flex-start;
  }

  &--reduced {
    @include respond-to(tablet) {
      justify-content: center;
    }
  }
}
</style>
