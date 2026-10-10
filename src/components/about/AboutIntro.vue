<template>
  <section class="about-intro">
    <div class="about-intro__card">
      <h2 class="about-intro__title">Nuestra Historia</h2>
      <p class="about-intro__text">
        EducAlba nace de una vocación que comenzó mucho antes de abrir sus puertas.
      </p>
      <p class="about-intro__text">
        Una historia de aprendizaje, experiencia y, sobre todo, pasión por enseñar y acompañar a
        cada alumno en su camino.
      </p>
      <span class="about-intro__icon material-symbols-outlined" aria-hidden="true">palette</span>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss">
.about-intro {
  padding: 2rem 0 3rem;

  &__card {
    position: relative;
    margin: 2rem auto 0;
    width: 100%;
    padding: 1.5rem 1.75rem;
    background-color: $color-background-soft;
    transform: rotate(-1deg);
    transition: transform 0.2s ease;
    @include doodle-frame;

    @include respond-to(desktop) {
      margin: 5rem auto 0;
      width: 70%;
      padding: 2rem 3.5rem;
    }

    &:hover {
      transform: rotate(0deg);
    }
  }

  &__title {
    margin: 0 0 1.5rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;
    text-align: center;

    @include respond-to(desktop) {
      margin: 0 0 3rem;
      font-size: 5rem;
    }
  }

  &__text {
    margin: 0 0 1rem;
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__icon {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    font-size: 2rem;
    color: $color-primary;
  }
}
</style>
