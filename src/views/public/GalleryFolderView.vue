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
      <h1 class="folder-view__title">{{ folderName }}</h1>

      <div class="folder-view__grid">
        <GalleryPhotoCard v-for="photo in photos" :key="photo.id" :photo="photo" />
      </div>

      <button
        v-if="hasMore"
        type="button"
        class="folder-view__load-more"
        :disabled="loadingMore"
        @click="loadMore"
      >
        {{ loadingMore ? 'Cargando…' : 'Cargar Más Recuerdos' }}
      </button>
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
import { fetchGalleryFolder } from '@/services/gallery'
import GalleryPhotoCard from '@/components/gallery/GalleryPhotoCard.vue'

// Numero de fotos que pedimos al backend en cada pagina
const PAGE_SIZE = 8

const route = useRoute()
const folderId = Number(route.params.folderId)

const status = ref('loading')
const folderName = ref('')
const photos = ref([])
const page = ref(0)
const hasMore = ref(false)
const loadingMore = ref(false)

// Pide una pagina de fotos de esta carpeta al backend y la acumula en
// "photos", sin perder las que ya se habian cargado antes
async function loadPage(pageNumber) {
  const response = await fetchGalleryFolder(folderId, pageNumber, PAGE_SIZE)

  folderName.value = response.data.name
  photos.value = [...photos.value, ...response.data.photos]
  hasMore.value = response.data.hasMore
  page.value = pageNumber
}

onMounted(async () => {
  try {
    await loadPage(0)
    status.value = photos.value.length > 0 ? 'found' : 'empty'
  } catch {
    status.value = 'error'
  }
})

// Pide la siguiente pagina de fotos cuando el usuario pulsa el boton
// "Cargar Mas Recuerdos"
async function loadMore() {
  loadingMore.value = true

  try {
    await loadPage(page.value + 1)
  } catch {
    // Si falla la carga de mas fotos, dejamos las ya cargadas visibles
    // y el boton disponible para que el usuario pueda reintentarlo
  } finally {
    loadingMore.value = false
  }
}
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

  &__load-more {
    display: block;
    margin: 2.5rem auto 0;
    padding: 0.5rem 1.25rem;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-background;
    font-family: $font-body;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: filter 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      filter: brightness(0.9);
    }

    &:focus-visible {
      outline: 2px solid $color-accent-yellow;
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
