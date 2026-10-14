<template>
  <section class="gallery-folder-section">
    <h2 class="gallery-folder-section__title">{{ folder.name }}</h2>
    <div class="gallery-folder-section__grid">
      <GalleryPhotoCard v-for="photo in folder.photos" :key="photo.id" :photo="photo" />
    </div>
  </section>
</template>

<script setup>
import GalleryPhotoCard from './GalleryPhotoCard.vue'

defineProps({
  // Carpeta de la galería a mostrar: { id, name, photos }
  folder: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss">
.gallery-folder-section {
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }

  &__title {
    margin: 0 0 1.5rem;
    font-family: $font-doodle;
    font-size: 2rem;
    color: $color-primary;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(desktop) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
