<template>
  <section class="gallery-grid">
    <p v-if="status === 'loading'" class="gallery-grid__message">Cargando fotos…</p>

    <div v-else-if="status === 'has-folders'" class="gallery-grid__folders">
      <GalleryFolderCard v-for="folder in folders" :key="folder.id" :folder="folder" />
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
import GalleryFolderCard from './GalleryFolderCard.vue'

const status = ref('loading')
const folders = ref([])

onMounted(async () => {
  try {
    const response = await fetchGalleryFolders()

    folders.value = response.data.filter((folder) => folder.photos.length > 0)

    status.value = folders.value.length > 0 ? 'has-folders' : 'empty'
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

  &__folders {
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
