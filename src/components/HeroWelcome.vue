<template>
  <section class="hero-welcome">
    <p class="hero-welcome__tagline">Enseñar con paciencia, aprender con confianza</p>
  </section>
</template>

<script setup>
</script>

<style lang="scss">
.hero-welcome {
  &__tagline {
    margin: 1.5rem 0;
    font-family: $font-doodle;
    font-size: 1.5rem;
    color: $color-primary;
    text-align: center;

    @include respond-to(tablet) {
      font-size: 2rem;
      text-align: left;
    }
  }
}
</style>
