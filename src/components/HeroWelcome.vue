<template>
  <section class="hero-welcome">
    <p class="hero-welcome__tagline">Enseñar con paciencia, aprender con confianza</p>
    <div class="hero-welcome__image-wrapper">
      <img
        class="hero-welcome__image"
        src="@/assets/hero-doodles.jpg"
        alt="Ilustración doodle con un arcoíris, un sol sonriente y material escolar sobre fondo de cuaderno"
        loading="lazy"
      />
    </div>
  </section>
</template>

<script setup>
</script>

<style lang="scss">
.hero-welcome {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 2rem;

  @include respond-to(tablet) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
  }

  &__tagline {
    margin: 0;
    font-family: $font-doodle;
    font-size: 3rem;
    line-height: 1.3;
    color: $color-primary;
    text-align: left;

    @include respond-to(tablet) {
      flex: 1;
      font-size: 4rem;
    }
  }

  &__image-wrapper {
    width: 100%;
    max-width: 400px;
    overflow: hidden;
    background-color: $color-background;
    transform: rotate(2deg);
    @include doodle-frame;

    @include respond-to(tablet) {
      flex: 1;
    }
  }

  &__image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}
</style>
