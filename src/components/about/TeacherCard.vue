<template>
  <article class="teacher-card">
    <div class="teacher-card__avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    </div>

    <h3 class="teacher-card__name">{{ teacher.name }}</h3>
    <p class="teacher-card__specialty">{{ teacher.specialty }}</p>
  </article>
</template>

<script setup>
// Tarjeta de un único profesor: recibe sus datos ya cargados por el
// componente padre (TeachersSection) y solo se encarga de mostrarlos
defineProps({
  teacher: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss">
.teacher-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  @include doodle-frame;

  &:nth-child(3n+1) {
    background-color: $color-accent-yellow-soft;
  }

  &:nth-child(3n+2) {
    background-color: $color-accent-pink;
  }

  &:nth-child(3n+3) {
    background-color: $color-accent-green-soft;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.5rem;
    height: 4.5rem;
    flex-shrink: 0;
    border: 2px solid $color-text-dark;
    border-radius: 50%;
    background-color: $color-background;
    color: $color-text-dark;

    svg {
      width: 2.25rem;
      height: 2.25rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &__name {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__specialty {
    margin: 0;
    font-family: $font-doodle;
    font-style: italic;
    font-size: 1.0625rem;
    color: $color-text-dark;
  }
}
</style>
