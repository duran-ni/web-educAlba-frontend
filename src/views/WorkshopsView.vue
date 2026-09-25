<template>
  <header class="workshops-heading">
    <h1 class="workshops-heading__title">
      Talleres
      <span class="workshops-heading__highlight" aria-hidden="true"></span>
    </h1>
  </header>

  <WorkshopsList />
</template>

<script setup>
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
}
</style>
