<template>
  <section class="timeline">
    <h2 class="timeline__heading">Cómo Empezó Todo</h2>

    <ol class="timeline__list">
      <li v-for="milestone in MILESTONES" :key="milestone.year" class="timeline__item">
        <div class="timeline__spacer" aria-hidden="true"></div>

        <div
          class="timeline__connector"
          :class="`timeline__connector--${milestone.color}`"
          aria-hidden="true"
        ></div>

        <article class="timeline__card" :class="`timeline__card--${milestone.color}`">
          <h3 class="timeline__title">{{ milestone.title }}</h3>
          <p class="timeline__text">{{ milestone.text }}</p>
        </article>

        <div class="timeline__marker" :class="`timeline__marker--${milestone.color}`">
          <span class="timeline__year">{{ milestone.year }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
// Contenido fijo de la historia de la academia: tres hitos cronológicos narrados
// en primera persona por la fundadora. No viene del backend: es contenido fijo
// de la propia web (misma decisión que ya se tomó para ReinforcementStages).
const MILESTONES = [
  {
    year: 2017,
    title: 'Nace una vocación',
    text: 'Comencé mi carrera movida por algo que siempre había tenido claro: me encantaba enseñar. Descubrir que podía ayudar a otros a aprender, avanzar y confiar más en sí mismos convirtió esa ilusión en mi verdadera vocación.',
    color: 'yellow',
  },
  {
    year: 2022,
    title: 'Aprender para ayudar mejor',
    text: 'Con los años entendí que cada alumno aprende de una manera diferente. Por eso decidí especializarme en Dificultades del Aprendizaje, para poder comprender mejor sus necesidades y ofrecer a cada estudiante el acompañamiento que realmente necesita.',
    color: 'pink',
  },
  {
    year: 2026,
    title: 'Nace EducaAlba',
    text: 'Después de casi diez años dedicándome a la enseñanza, llegó el momento de dar un paso más y cumplir un sueño: abrir mi propia academia. Así nace EducaAlba, un espacio creado con mucha ilusión donde enseñar, acompañar y conseguir que cada alumno descubra todo lo que es capaz de lograr.',
    color: 'green',
  },
]
</script>

<style lang="scss">
.timeline {
  padding: 3rem 0;

  &__heading {
    margin: 0 0 7rem;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-text-dark;
    text-align: center;
  }

  &__list {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4.5rem;

    @include respond-to(desktop) {
      gap: 7rem;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-left: 2px dashed $color-text-dark;
      }
    }
  }

  &__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    @include respond-to(desktop) {
      flex-direction: row;
      align-items: center;
      gap: 0;

      &:nth-child(even) {
        flex-direction: row-reverse;

        .timeline__connector {
          flex-direction: row-reverse;
        }
      }
    }
  }

  &__spacer {
    display: none;

    @include respond-to(desktop) {
      display: block;
      flex: 0 0 50%;
    }
  }

  &__connector {
    display: none;

    @include respond-to(desktop) {
      display: flex;
      align-items: center;
      flex: 0 0 8.25rem;

      &::before {
        content: '';
        flex: 1;
        height: 2px;
        background-color: currentColor;
      }

      &::after {
        content: '';
        flex-shrink: 0;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: currentColor;
      }
    }

    &--yellow {
      color: $color-accent-yellow;
    }

    &--pink {
      color: $color-accent-pink-medium;
    }

    &--green {
      color: $color-green-dark;
    }
  }

  &__card {
    width: 100%;
    padding: 1.5rem;
    background-color: $color-background;
    @include doodle-frame;

    @include respond-to(desktop) {
      flex: 1;
      max-width: 35rem;
    }

    &--yellow {
      border-style: dashed;
      background-color: $color-accent-yellow-soft;
    }

    &--pink {
      border-style: dashed;
      background-color: $color-accent-pink;
    }

    &--green {
      border-style: dashed;
      background-color: $color-accent-green-soft;
    }
  }

  &__marker {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 3.5rem;
    height: 3.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 50%;
    background-color: $color-background;

    @include respond-to(desktop) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }

    &--yellow {
      border-color: $color-accent-yellow;
      color: $color-accent-yellow;
    }

    &--pink {
      border-color: $color-accent-pink-medium;
      color: $color-accent-pink-medium;
    }

    &--green {
      border-color: $color-green-dark;
      color: $color-green-dark;
    }
  }

  &__year {
    font-family: $font-heading;
    font-size: 0.9375rem;
    font-weight: 700;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-family: $font-heading;
    font-size: 1.75rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__text {
    margin: 0;
    font-family: $font-body;
    font-size: 1.1rem;
    color: $color-text-dark;
  }
}
</style>
