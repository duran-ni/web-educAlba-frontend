<template>
  <header class="reinforcement-heading">
    <svg class="reinforcement-heading__star" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 10C50 30 70 50 90 50C70 50 50 70 50 90C50 70 30 50 10 50C30 50 50 30 50 10Z" />
    </svg>
    <svg class="reinforcement-heading__waves" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M10 50 Q 30 10 50 50 T 90 50" class="reinforcement-heading__wave reinforcement-heading__wave--primary" />
      <path d="M10 60 Q 30 20 50 60 T 90 60" class="reinforcement-heading__wave reinforcement-heading__wave--pink" />
    </svg>
    <h1 class="reinforcement-heading__title">
      Clases de Refuerzo
      <span class="reinforcement-heading__highlight" aria-hidden="true"></span>
    </h1>
    <p class="reinforcement-heading__subtitle">
      ¡Dale un empujón a tus notas! Reforzamos los conocimientos con una metodología práctica, cercana y muy divertida.
    </p>
  </header>

  <ReinforcementStages />

  <section class="tutoring-cta">
    <h2 class="tutoring-cta__title">¿Necesitas ayuda con algo específico?</h2>
    <RouterLink
      class="tutoring-cta__button"
      :to="{ name: 'contact', query: { subject: 'Solicitud de tutoría personalizada' } }"
    >
      Reserva una tutoría
      <svg class="tutoring-cta__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 12h14M13 6l6 6-6 6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ReinforcementStages from '@/components/ReinforcementStages.vue'
</script>

<style lang="scss">
.reinforcement-heading {
  position: relative;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 4rem;

  @include respond-to(tablet) {
    margin-top: 3rem;
  }

  &__title {
    position: relative;
    z-index: 1;
    display: inline-block;
    margin: 1rem 0 0;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-primary;

    @include respond-to(tablet) {
      font-size: 3.5rem;
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
    max-width: 42rem;
    margin: 3rem auto 0;
    padding: 1rem 1.5rem;
    border: 2px dashed $color-text-dark;
    border-radius: 1rem;
    background-color: rgba($color-background, 0.8);
    font-family: $font-body;
    font-size: 1.125rem;
    color: $color-text-dark;
  }

  &__star {
    display: none;
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 10rem;
    height: auto;
    fill: $color-accent-yellow;
    pointer-events: none;

    @include respond-to(tablet) {
      display: block;
      left: 3rem;
    }
  }

  &__waves {
    display: none;
    position: absolute;
    top: 3rem;
    right: 1rem;
    width: 10rem;
    height: auto;
    pointer-events: none;

    @include respond-to(tablet) {
      display: block;
      right: 3rem;
    }
  }

  &__wave {
    fill: none;
    stroke-width: 4;
    stroke-linecap: round;

    &--primary {
      stroke: $color-primary;
    }

    &--pink {
      stroke: $color-accent-pink;
    }
  }
}

.tutoring-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin: 4rem auto;
  padding: 0 1.5rem;
  text-align: center;

  &__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.75rem;
    color: $color-text-dark;
  }

  &__button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: transparent;
    color: $color-primary;
    font-family: $font-body;
    font-weight: 600;
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-primary;
      color: $color-background;
    }

    &:hover .tutoring-cta__arrow,
    &:focus-visible .tutoring-cta__arrow {
      transform: translateX(0.25rem);
    }
  }

  &__arrow {
    width: 1.125rem;
    height: 1.125rem;
    transition: transform 0.2s ease;
  }
}
</style>
