<template>
  <section class="folder-view">
    <RouterLink class="folder-view__back" :to="{ name: 'gallery' }">
      <svg class="folder-view__back-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M20 12H6M11 18l-6-6 6-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Volver a la galería
    </RouterLink>

    <p v-if="status === 'loading'" class="folder-view__message">Cargando fotos…</p>

    <template v-else-if="status === 'found'">
      <h1 class="folder-view__title">{{ folder.name }}</h1>

      <div class="folder-view__grid">
        <GalleryPhotoCard v-for="photo in folder.photos" :key="photo.id" :photo="photo" />
      </div>
    </template>

    <p v-else-if="status === 'empty'" class="folder-view__message">
      Esta carpeta todavía no tiene fotos.
    </p>

    <p v-else class="folder-view__message">
      No hemos podido cargar esta carpeta. Inténtalo de nuevo más tarde.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { fetchGalleryFolders } from '@/services/gallery'
import GalleryPhotoCard from '@/components/gallery/GalleryPhotoCard.vue'

const route = useRoute()

const status = ref('loading')
const folder = ref(null)

onMounted(async () => {
  try {
    const response = await fetchGalleryFolders()
    const folderId = Number(route.params.folderId)
    const foundFolder = response.data.find((candidate) => candidate.id === folderId)

    if (!foundFolder) {
      status.value = 'error'
      return
    }

    folder.value = foundFolder
    status.value = foundFolder.photos.length > 0 ? 'found' : 'empty'
  } catch {
    status.value = 'error'
  }
})
</script>

<style lang="scss">
.folder-view {
  margin-top: 2rem;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-family: $font-heading;
    font-size: 0.95rem;
    color: $color-primary;
    text-decoration: none;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__back-arrow {
    width: 1.125rem;
    height: 1.125rem;
  }

  &__title {
    margin: 0 0 2rem;
    font-family: $font-doodle;
    font-size: 3rem;
    color: $color-primary;
    text-align: center;

    @include respond-to(tablet) {
      font-size: 3.5rem;
    }
  }

  &__message {
    margin: 0;
    color: $color-text-dark;
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
