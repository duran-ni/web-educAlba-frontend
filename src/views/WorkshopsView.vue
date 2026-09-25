<template>
  <header class="workshops-heading">
    <h1 class="workshops-heading__title">
      Talleres
      <span class="workshops-heading__highlight" aria-hidden="true"></span>
    </h1>
    <p class="workshops-heading__subtitle">Talleres impartidos en Academia EducAlba</p>
  </header>

  <WorkshopsCalendar />

  <WorkshopsList />
</template>

<script setup>
import WorkshopsCalendar from '@/components/WorkshopsCalendar.vue'
import WorkshopsList from '@/components/WorkshopsList.vue'
</script>

<style lang="scss">
.workshops-heading {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2.5rem;

  @include respond-to(tablet) {
    margin-top: 3rem;
  }

  &__title {
    position: relative;
    display: inline-block;
    margin: 0;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-primary;

    @include respond-to(tablet) {
      font-size: 4rem;
    }
  }

  &__highlight {
    position: absolute;
    left: 0;
    bottom: -0.25rem;
    width: 100%;
    height: 0.5rem;
    background-color: $color-accent-yellow;
    opacity: 0.5;
    transform: rotate(-2deg);
    z-index: -1;
  }

  &__subtitle {
    margin: 2rem 0 0;
    font-family: $font-doodle;
    font-size: 2rem;
    color: $color-green-dark;
  }
}
</style>
