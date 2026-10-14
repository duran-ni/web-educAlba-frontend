<template>
  <section class="gallery-grid">
    <p v-if="status === 'loading'" class="gallery-grid__message">Cargando fotos…</p>

    <div v-else-if="status === 'has-photos'" class="gallery-grid__folders">
      <GalleryFolderSection v-for="folder in folders" :key="folder.id" :folder="folder" />
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
import { fetchGalleryFolders } from '@/services/gallery'
import GalleryFolderSection from './GalleryFolderSection.vue'

const status = ref('loading')
const folders = ref([])

onMounted(async () => {
  try {
    const response = await fetchGalleryFolders()
    folders.value = response.data

    // Solo hay fotos que mostrar si al menos una carpeta tiene alguna
    const hasPhotos = folders.value.some((folder) => folder.photos.length > 0)
    status.value = hasPhotos ? 'has-photos' : 'empty'
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
}
</style>
