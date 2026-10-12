<template>
  <header class="gallery-heading">
    <h1 class="gallery-heading__title">
      Galería
      <span class="gallery-heading__highlight" aria-hidden="true"></span>
    </h1>
    <p class="gallery-heading__subtitle">Momentos compartidos en Academia EducAlba</p>
  </header>

  <GalleryGrid />
</template>

<script setup>
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
</script>

<style lang="scss">
.gallery-heading {
  position: relative;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2.5rem;

  @include respond-to(tablet) {
    margin-top: 3rem;
  }

  &__title {
    position: relative;
    display: inline-block;
    margin: 0;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-primary;

    @include respond-to(tablet) {
      font-size: 4rem;
    }
  }

  &__highlight {
    position: absolute;
    left: 0;
    bottom: -0.25rem;
    width: 100%;
    height: 0.5rem;
    background-color: $color-accent-yellow;
    opacity: 0.5;
    transform: rotate(-2deg);
    z-index: -1;
  }

  &__subtitle {
    margin: 2rem 0 0;
    font-family: $font-doodle;
    font-size: 2rem;
    color: $color-green-dark;
  }
}
</style>
