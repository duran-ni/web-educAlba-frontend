<template>
  <section class="reinforcement-stages">
    <article
      v-for="stage in STAGES"
      :key="stage.name"
      class="reinforcement-stages__card"
    >
      <div
        v-if="stage.decoration === 'pin'"
        class="reinforcement-stages__decoration reinforcement-stages__decoration--pin"
        aria-hidden="true"
      >
        <svg viewBox="0 0 30 30">
          <circle cx="15" cy="10" r="8" />
          <path d="M15 18V28" />
          <path d="M10 10 L20 10" class="reinforcement-stages__decoration-highlight" />
        </svg>
      </div>
      <div
        v-else-if="stage.decoration === 'clip'"
        class="reinforcement-stages__decoration reinforcement-stages__decoration--clip"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 40">
          <path d="M12 2 V30 C12 34 16 34 16 30 V8 C16 6 20 6 20 8 V32 C20 38 4 38 4 32 V4" />
        </svg>
      </div>
      <div
        v-else
        class="reinforcement-stages__decoration reinforcement-stages__decoration--tape"
        aria-hidden="true"
      ></div>

      <div class="reinforcement-stages__header">
        <div class="reinforcement-stages__icon">
          <svg v-if="stage.icon === 'car'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 16 L5 11c0.3-1 1-1.5 2-1.5h10c1 0 1.7 0.5 2 1.5l1 5" />
            <path d="M4 16h16" />
            <circle cx="8" cy="17" r="1.5" />
            <circle cx="16" cy="17" r="1.5" />
          </svg>
          <svg v-else-if="stage.icon === 'book'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5c-2-1.5-5-2-8-1v13c3-1 6-0.5 8 1c2-1.5 5-2 8-1V4c-3-1-6-0.5-8 1Z" />
            <path d="M12 5v13" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4 2 9l10 5 10-5-10-5Z" />
            <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
            <path d="M20 9v5" />
          </svg>
        </div>

        <h2 class="reinforcement-stages__title">{{ stage.name }}</h2>
      </div>

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
// Contenido fijo de la página de Refuerzo: cada etapa educativa con sus materias,
// el rango de edad/curso, un icono acorde al título y una "decoración" de papelería
// (pin, clip o celo) igual que en el prototipo. No viene del backend: es contenido
// fijo de la propia web (decisión tomada explícitamente para esta historia).
const STAGES = [
  {
    name: 'Infantil',
    ageRange: '3 a 6 años',
    subjects: ['Lógico-matemático', 'Lectoescritura'],
    icon: 'car',
    decoration: 'pin',
  },
  {
    name: 'Primaria',
    ageRange: '1º a 6º Primaria',
    subjects: ['Lectoescritura', 'Cálculo', 'Hábitos de estudio', 'Acompañamiento con los deberes'],
    icon: 'book',
    decoration: 'clip',
  },
  {
    name: 'E.S.O.',
    ageRange: '1º a 4º E.S.O.',
    subjects: ['Matemáticas', 'Lengua', 'Inglés', 'Física', 'Química', 'Preparación de exámenes'],
    icon: 'cap',
    decoration: 'tape',
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
    position: relative;
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

  &__decoration {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    &--pin {
      width: 1.875rem;
      height: 1.875rem;

      circle {
        fill: $color-error;
        stroke: $color-text-dark;
        stroke-width: 2;
      }

      path {
        stroke: $color-text-dark;
        stroke-width: 2;
        stroke-linecap: round;
      }

      .reinforcement-stages__decoration-highlight {
        stroke: $color-background;
        opacity: 0.8;
      }
    }

    &--clip {
      top: -1.25rem;
      left: auto;
      right: 1.5rem;
      transform: rotate(12deg);
      width: 1.5rem;
      height: 2.5rem;

      path {
        fill: none;
        stroke: $color-text-dark;
        stroke-width: 2;
        stroke-linecap: round;
      }
    }

    &--tape {
      top: -0.75rem;
      width: 5rem;
      height: 1.5rem;
      background-color: $color-background-soft;
      opacity: 0.85;
      border: 1px solid $color-text-dark;
      transform: translateX(-50%) rotate(3deg);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0.5rem 0 1rem;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    flex-shrink: 0;
    border: 2px solid $color-text-dark;
    border-radius: 50%;
    background-color: $color-background;
    color: $color-text-dark;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &__title {
    margin: 0;
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
