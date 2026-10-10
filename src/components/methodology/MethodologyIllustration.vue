<template>
  <section class="methodology-illustration">
    <div class="methodology-illustration__frame">
      <div class="methodology-illustration__tape" aria-hidden="true"></div>

      <div class="methodology-illustration__inner">
        <img
          class="methodology-illustration__image"
          src="@/assets/imagen.png"
          alt="Ilustración de un escritorio con un cuaderno abierto donde se muestran las asignaturas que se imparten, lápices de colores y una tablet mostrando los cursos de la academia"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss">
.methodology-illustration {
  padding: 2rem 1rem 3rem;
  display: flex;
  justify-content: center;

  &__frame {
    position: relative;
    width: 100%;
    max-width: 30rem;
    padding: 0.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 4px;
    background-color: $color-background;
    transform: rotate(-1deg);

    @include respond-to(desktop) {
      max-width: 55rem;
      box-shadow: 10px 10px 0 0 $color-text-dark;
    }
  }

  &__inner {
    overflow: hidden;
    border: 2px dashed $color-text-dark;
    border-radius: 4px;
  }

  &__tape {
    position: absolute;
    z-index: 2;
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

  &__image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
</style>
