<template>
  <HeroWelcome />

  <div class="home-bento-grid">
    <QuickInterestForm />
    <NextWorkshopCard />
  </div>

  <QuickContactCta />
</template>

<script setup>
import HeroWelcome from '@/components/HeroWelcome.vue'
import QuickInterestForm from '@/components/QuickInterestForm.vue'
import NextWorkshopCard from '@/components/NextWorkshopCard.vue'
import QuickContactCta from '@/components/QuickContactCta.vue'
</script>

<style lang="scss">
// Cuadrícula "bento" que agrupa el formulario de interés rápido y el
// próximo taller, uno junto al otro.
.home-bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-top: 2rem;

  @include respond-to(tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }
}
</style>
