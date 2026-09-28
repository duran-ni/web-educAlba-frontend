<template>
  <section class="reinforcement-stages">
    <article
      v-for="stage in STAGES"
      :key="stage.name"
      class="reinforcement-stages__card"
    >
      <h2 class="reinforcement-stages__title">{{ stage.name }}</h2>

      <ul class="reinforcement-stages__list">
        <li v-for="subject in stage.subjects" :key="subject" class="reinforcement-stages__item">
          {{ subject }}
        </li>
      </ul>

      <span class="reinforcement-stages__badge">{{ stage.ageRange }}</span>
    </article>
  </section>
</template>

<script setup>
// Contenido fijo de la página de Refuerzo: cada etapa educativa con sus materias
// y el rango de edad/curso al que corresponde. No viene del backend: es contenido
// fijo de la propia web,
// no editable desde un panel de administrador.
const STAGES = [
  {
    name: 'Infantil',
    ageRange: '3 a 6 años',
    subjects: ['Lógico-matemático', 'Lectoescritura'],
  },
  {
    name: 'Primaria',
    ageRange: '1º a 6º Primaria',
    subjects: ['Lectoescritura', 'Cálculo', 'Hábitos de estudio', 'Acompañamiento con los deberes'],
  },
  {
    name: 'E.S.O.',
    ageRange: '1º a 4º E.S.O.',
    subjects: ['Matemáticas', 'Lengua', 'Inglés', 'Física', 'Química', 'Preparación de exámenes'],
  },
]
</script>

<style lang="scss">
.reinforcement-stages {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @include respond-to(tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(desktop) {
    grid-template-columns: repeat(3, 1fr);
  }

  &__card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
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
  }

  &__title {
    margin: 0 0 1rem;
    font-family: $font-doodle;
    font-size: 1.75rem;
    color: $color-text-dark;
  }

  &__list {
    flex: 1;
    margin: 0 0 1.5rem;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__item {
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;

    &::before {
      content: '✓ ';
      font-weight: 700;
    }
  }

  &__badge {
    align-self: flex-start;
    padding: 0.25rem 0.75rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    font-family: $font-heading;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-text-dark;
    background-color: $color-background;
  }
}
</style>
