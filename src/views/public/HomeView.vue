<template>
  <HeroWelcome />

  <div class="home-bento-grid">
    <QuickInterestForm />
    <NextWorkshopCard />
  </div>

  <QuickContactCta />
</template>

<script setup>
import HeroWelcome from '@/components/home/HeroWelcome.vue'
import QuickInterestForm from '@/components/home/QuickInterestForm.vue'
import NextWorkshopCard from '@/components/home/NextWorkshopCard.vue'
import QuickContactCta from '@/components/home/QuickContactCta.vue'
</script>

<style lang="scss">
// Cuadrícula "bento" que agrupa el formulario de interés rápido y el
// próximo taller, uno junto al otro.
.home-bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-top: 5rem;

  @include respond-to(tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 7rem;
  }
}
</style>
