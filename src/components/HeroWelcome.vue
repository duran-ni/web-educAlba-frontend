<template>
  <section class="hero-welcome">
    <img
      class="hero-welcome__image"
      src="@/assets/hero-doodles.jpg"
      alt="Ilustración decorativa estilo cuaderno: un arcoíris, un sol sonriente, una mariposa, una flor, nubes, corazones, estrellas y un libro abierto con lápices de colores, sobre un fondo de papel cuadriculado"
      loading="lazy"
    />
    <p class="hero-welcome__tagline">Enseñar con paciencia, aprender con confianza</p>
  </section>
</template>

<script setup></script>

<style lang="scss">
.hero-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @include respond-to(tablet) {
    flex-direction: row;
    justify-content: space-between;
  }

  &__image {
    width: 100%;
    max-width: 400px;
    border-radius: 1rem;

    @include respond-to(tablet) {
      flex: 1;
    }
  }

  &__tagline {
    margin: 0;
    font-family: $font-doodle;
    font-size: 1.5rem;
    color: $color-primary;
    text-align: center;

    @include respond-to(tablet) {
      flex: 1;
      font-size: 2rem;
      text-align: left;
    }
  }
}
</style>
