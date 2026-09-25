<template>
  <header class="workshops-heading">
    <svg class="workshops-heading__cloud" viewBox="0 -3 72 47" aria-hidden="true">
      <path
        d="M18 38c-8 0-14-6-14-13c0-6 4-11 10-13c2-7 9-12 17-12c9 0 16 6 18 14c8 1 14 8 14 16c0 7-6 12-13 12z"
      />
    </svg>

    <svg class="workshops-heading__sun" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="20" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="3" />
      <line x1="50" y1="10" x2="50" y2="25" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="50" y1="90" x2="50" y2="75" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="10" y1="50" x2="25" y2="50" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="90" y1="50" x2="75" y2="50" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="20" y1="20" x2="32" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="80" y1="80" x2="68" y2="68" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="20" y1="80" x2="32" y2="68" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="80" y1="20" x2="68" y2="32" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <circle class="workshops-heading__sun-eye" cx="42" cy="45" r="3" />
      <circle class="workshops-heading__sun-eye" cx="58" cy="45" r="3" />
      <path class="workshops-heading__sun-mouth" d="M40 55 Q50 65 60 55" />
    </svg>

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
  position: relative;
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

  &__cloud {
    display: none;
    position: absolute;
    top: 2.5rem;
    left: 1rem;
    width: 9rem;
    height: auto;
    pointer-events: none;

    path {
      fill: $color-background-soft;
      stroke: $color-primary;
      stroke-width: 3;
      stroke-linejoin: round;
    }

    @include respond-to(tablet) {
      display: block;
      left: 3rem;
    }
  }

  &__sun {
    display: none;
    position: absolute;
    top: 1.2rem;
    right: 1rem;
    width: 10rem;
    height: auto;
    color: $color-accent-yellow;
    pointer-events: none;

    @include respond-to(tablet) {
      display: block;
      right: 3rem;
    }
  }

  &__sun-eye {
    fill: $color-text-dark;
  }

  &__sun-mouth {
    fill: none;
    stroke: $color-text-dark;
    stroke-width: 2;
    stroke-linecap: round;
  }
}
</style>
