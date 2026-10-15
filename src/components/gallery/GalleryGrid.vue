<template>
  <section class="gallery-grid">
    <p v-if="status === 'loading'" class="gallery-grid__message">Cargando fotos…</p>

    <template v-else-if="status === 'has-folders'">
      <div class="gallery-grid__folders">
        <GalleryFolderCard v-for="folder in folders" :key="folder.id" :folder="folder" />
      </div>

      <button
        v-if="hasMore"
        type="button"
        class="gallery-grid__load-more"
        :disabled="loadingMore"
        @click="loadMore"
      >
        {{ loadingMore ? 'Cargando…' : 'Cargar Más Recuerdos' }}
      </button>
    </template>

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

// Numero de carpetas que pedimos al backend en cada pagina
const PAGE_SIZE = 8

const status = ref('loading')
const folders = ref([])
const page = ref(0)
const hasMore = ref(false)
const loadingMore = ref(false)

// Pide una pagina de carpetas al backend y acumula en "folders" solo las que
// ya tienen alguna foto subida (las vacias no se muestran en la galeria)
async function loadPage(pageNumber) {
  const response = await fetchGalleryFolders(pageNumber, PAGE_SIZE)
  const nonEmptyFolders = response.data.folders.filter((folder) => folder.photos.length > 0)

  folders.value = [...folders.value, ...nonEmptyFolders]
  hasMore.value = response.data.hasMore
  page.value = pageNumber
}

onMounted(async () => {
  try {
    await loadPage(0)
    status.value = folders.value.length > 0 ? 'has-folders' : 'empty'
  } catch {
    status.value = 'error'
  }
})

// Pide la siguiente pagina de carpetas cuando el usuario pulsa el boton
// "Cargar Mas Recuerdos", sin perder las carpetas ya mostradas
async function loadMore() {
  loadingMore.value = true

  try {
    await loadPage(page.value + 1)
    status.value = folders.value.length > 0 ? 'has-folders' : status.value
  } catch {
    // Si falla la carga de mas carpetas, dejamos las ya cargadas visibles
    // y el boton disponible para que el usuario pueda reintentarlo
  } finally {
    loadingMore.value = false
  }
}
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
