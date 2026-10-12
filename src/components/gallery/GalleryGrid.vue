<template>
  <section class="gallery-grid">
    <p v-if="status === 'loading'" class="gallery-grid__message">Cargando fotos…</p>

    <div v-else-if="status === 'has-photos'" class="gallery-grid__list">
      <GalleryPhotoCard v-for="photo in photos" :key="photo.id" :photo="photo" />
    </div>

    <p v-else-if="status === 'empty'" class="gallery-grid__message">
      Todavía no hay fotos en la galería.
    </p>

    <p v-else class="gallery-grid__message">
      No hemos podido cargar la galería. Inténtalo de nuevo más tarde.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchGalleryPhotos } from '@/services/gallery'
import GalleryPhotoCard from './GalleryPhotoCard.vue'

const status = ref('loading')
const photos = ref([])

onMounted(async () => {
  try {
    const response = await fetchGalleryPhotos()
    photos.value = response.data

    status.value = photos.value.length > 0 ? 'has-photos' : 'empty'
  } catch {
    status.value = 'error'
  }
})
</script>

<style lang="scss">
.gallery-grid {
  margin-top: 3rem;

  &__message {
    margin: 0;
    color: $color-text-dark;
    text-align: center;
  }

  &__list {
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
