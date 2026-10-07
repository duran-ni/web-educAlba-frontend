<template>
  <section class="methodology">
    <h2 class="methodology__heading">Nuestra Metodología</h2>

    <div class="methodology__intro">
      <span
        class="methodology__intro-icon methodology__intro-icon--start material-symbols-outlined"
        aria-hidden="true"
      >
        edit
      </span>

      <p>
        No somos una academia tradicional. Creemos en aprender tocando, dibujando y equivocándose
        (¡con goma de borrar a mano!).
      </p>
      <p>Aquí los apuntes tienen colores y las dudas son el principio de una gran idea.</p>

      <span
        class="methodology__intro-icon methodology__intro-icon--end material-symbols-outlined"
        aria-hidden="true"
      >
        ink_eraser
      </span>
    </div>

    <div class="methodology__grid">
      <article
        v-for="block in BLOCKS"
        :key="block.title"
        class="methodology__card"
        :class="`methodology__card--${block.color}`"
      >
        <div class="methodology__tape" aria-hidden="true"></div>
        <span v-if="block.highlight" class="methodology__tag">¡Importante!</span>

        <div class="methodology__header">
          <span class="methodology__icon material-symbols-outlined" aria-hidden="true">
            {{ block.icon }}
          </span>
          <h3 class="methodology__title">{{ block.title }}</h3>
        </div>

        <p class="methodology__text">{{ block.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
// Contenido fijo de la metodología de la academia: 5 bloques con icono, título
// y descripción.
const BLOCKS = [
  {
    title: 'Atención a dificultades del aprendizaje',
    text: 'Apoyo individualizado para identificar dificultades, reforzar contenidos y mejorar el aprendizaje.',
    icon: 'psychology',
    color: 'pink',
  },
  {
    title: 'Grupos reducidos',
    text: 'Clases con pocos alumnos para ofrecer una atención más cercana, personalizada y adaptada a cada ritmo.',
    icon: 'groups',
    color: 'green',
    highlight: true,
  },
  {
    title: 'Técnicas de estudio',
    text: 'Aprendemos a organizarse, resumir, memorizar y planificar el tiempo para estudiar de forma más eficaz.',
    icon: 'checklist',
    color: 'yellow',
  },
  {
    title: 'Refuerzo escolar',
    text: 'Acompañamiento en las diferentes materias para resolver dudas, afianzar contenidos y mejorar el rendimiento.',
    icon: 'menu_book',
    color: 'blue',
  },
  {
    title: 'Talleres',
    text: 'Actividades prácticas y creativas de naturaleza, lectoescritura, psicomotricidad…',
    icon: 'palette',
    color: 'purple',
  },
]
</script>

<style lang="scss">
.methodology {
  padding: 3rem 0;

  &__heading {
    display: table;
    margin: 1.5rem auto 3rem;
    padding: 1rem 1.75rem;
    background-color: $color-accent-yellow;
    transform: rotate(-1deg);
    font-family: $font-doodle;
    font-size: 2rem;
    color: $color-primary;
    text-align: center;
    @include doodle-frame;

    @include respond-to(desktop) {
      margin: 2rem auto 5rem;
      padding: 1.5rem 3rem;
      font-size: 3.25rem;
    }
  }

  &__intro {
    position: relative;
    max-width: 24rem;
    margin: 0 auto 3rem;
    font-family: $font-body;
    font-size: 1rem;
    line-height: 1.6;
    color: $color-text-dark;
    text-align: center;

    @include respond-to(desktop) {
      max-width: 80rem;
      margin-bottom: 6rem;
      font-size: 1.25rem;
    }
  }

  &__intro-icon {
    display: none;
    position: absolute;
    font-size: 1.75rem;
    color: $color-primary;

    @include respond-to(desktop) {
      display: block;
    }

    &--start {
      top: -1.5rem;
      left: -1rem;
    }

    &--end {
      bottom: -1rem;
      right: 14rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(desktop) {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 2rem 1.5rem 3rem;
    transition: transform 0.2s ease;
    @include doodle-frame;

    &:hover {
      transform: rotate(0deg);
    }

    @include respond-to(desktop) {
      grid-column: span 2;
      min-height: 16rem;
      padding: 3rem 2rem 5rem;

      &:nth-child(4),
      &:nth-child(5) {
        grid-column: span 3;
      }
    }

    &--pink {
      background-color: $color-accent-pink;
      border-style: dashed;
      transform: rotate(3deg);
    }

    &--green {
      background-color: $color-accent-green-soft;
      transform: rotate(-2deg);
    }

    &--yellow {
      background-color: $color-accent-yellow-soft;
      border-style: dashed;
      transform: rotate(4deg);
    }

    &--blue {
      background-color: $color-background-soft;
      transform: rotate(-2.5deg);
    }

    &--purple {
      background-color: $color-accent-purple-soft;
      transform: rotate(3.5deg);
    }
  }

  &__tape {
    position: absolute;
    top: -0.75rem;
    left: 50%;
    transform: translateX(-50%) rotate(-3deg);
    width: 5rem;
    height: 1.5rem;
    background-color: $color-background-soft;
    opacity: 0.85;
    border: 1px solid $color-text-dark;
    pointer-events: none;
  }

  &__tag {
    position: absolute;
    top: -0.75rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-error;
    font-family: $font-heading;
    font-size: 0.75rem;
    font-weight: 700;
    color: $color-background;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 3px dashed $color-text-dark;
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
    font-size: 1.5rem;
    color: $color-text-dark;
  }

  &__title {
    margin: 0;
    font-family: $font-doodle;
    font-size: 2.5rem;
    font-weight: 700;
    font-style: italic;
    color: $color-text-dark;
  }

  &__text {
    margin: 0;
    font-family: $font-body;
    font-size: 1.4rem;
    line-height: 1.5;
    color: $color-text-dark;

    @include respond-to(desktop) {
      font-size: 1.4rem;
    }
  }
}
</style>
