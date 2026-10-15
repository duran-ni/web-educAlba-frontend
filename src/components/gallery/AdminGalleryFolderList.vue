<template>
  <section class="admin-gallery-folder-list">
    <h2 class="admin-gallery-folder-list__title">Carpetas</h2>

    <p v-if="status === 'loading'" class="admin-gallery-folder-list__message">Cargando carpetas…</p>

    <p
      v-else-if="status === 'error'"
      class="admin-gallery-folder-list__message admin-gallery-folder-list__message--error"
    >
      No hemos podido cargar la galería. Inténtalo de nuevo más tarde.
    </p>

    <p v-else-if="folders.length === 0" class="admin-gallery-folder-list__message">
      Todavía no hay carpetas creadas.
    </p>

    <ul v-else class="admin-gallery-folder-list__items">
      <li v-for="folder in folders" :key="folder.id" class="admin-gallery-folder-list__item">
        <div class="admin-gallery-folder-list__item-row">
          <div class="admin-gallery-folder-list__item-info">
            <p class="admin-gallery-folder-list__item-name">{{ folder.name }}</p>
            <p class="admin-gallery-folder-list__item-details">
              {{ folder.photoCount }} foto{{ folder.photoCount === 1 ? '' : 's' }}
            </p>
          </div>

          <div class="admin-gallery-folder-list__item-actions">
            <button
              type="button"
              class="admin-gallery-folder-list__photos-toggle"
              :aria-expanded="isExpanded(folder.id)"
              @click="toggleFolder(folder.id)"
            >
              Ver fotos ({{ folder.photoCount }})
            </button>

            <button
              type="button"
              class="admin-gallery-folder-list__upload"
              @click="$emit('upload-photo', folder)"
            >
              Subir foto
            </button>

            <button
              type="button"
              class="admin-gallery-folder-list__delete"
              @click="handleDeleteFolderClick(folder)"
            >
              Eliminar carpeta
            </button>
          </div>
        </div>

        <ul v-if="isExpanded(folder.id)" class="admin-gallery-folder-list__photos">
          <li
            v-if="photosForFolder(folder.id).length === 0"
            class="admin-gallery-folder-list__photos-empty"
          >
            Esta carpeta todavía no tiene fotos.
          </li>

          <li
            v-for="photo in photosForFolder(folder.id)"
            :key="photo.id"
            class="admin-gallery-folder-list__photo"
          >
            <img
              class="admin-gallery-folder-list__photo-image"
              :src="photo.imageUrl"
              :alt="photo.caption || ''"
              loading="lazy"
            />

            <p v-if="photo.caption" class="admin-gallery-folder-list__photo-caption">
              {{ photo.caption }}
            </p>

            <span
              v-if="folder.coverPhotoId === photo.id"
              class="admin-gallery-folder-list__photo-cover-badge"
            >
              Portada
            </span>

            <div class="admin-gallery-folder-list__photo-actions">
              <button
                v-if="folder.coverPhotoId !== photo.id"
                type="button"
                class="admin-gallery-folder-list__photo-cover"
                @click="$emit('set-cover', { folderId: folder.id, photoId: photo.id })"
              >
                Marcar como portada
              </button>

              <button
                type="button"
                class="admin-gallery-folder-list__photo-delete"
                @click="handleDeletePhotoClick(photo)"
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  folders: {
    type: Array,
    required: true,
  },
  photos: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['delete-folder', 'upload-photo', 'set-cover', 'delete-photo'])

// Guarda los ids de las carpetas cuyo listado de fotos esta desplegado; un
// Set permite tener varias carpetas abiertas a la vez sin duplicados
const expandedFolderIds = ref(new Set())

function isExpanded(folderId) {
  return expandedFolderIds.value.has(folderId)
}

function toggleFolder(folderId) {
  const next = new Set(expandedFolderIds.value)

  if (next.has(folderId)) {
    next.delete(folderId)
  } else {
    next.add(folderId)
  }

  expandedFolderIds.value = next
}

// Filtra, del lado del frontend, las fotos que pertenecen a esta carpeta
// concreta; evita pedir al backend un listado distinto por cada carpeta
function photosForFolder(folderId) {
  return props.photos.filter((photo) => photo.folderId === folderId)
}

// Pide confirmacion antes de avisar al componente padre, para evitar que
// un clic accidental borre una carpeta sin darse cuenta
function handleDeleteFolderClick(folder) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar la carpeta "${folder.name}"? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete-folder', folder.id)
  }
}

// Pide confirmacion antes de eliminar una foto en concreto
function handleDeletePhotoClick(photo) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar esta foto${photo.caption ? ` ("${photo.caption}")` : ''}? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete-photo', photo)
  }
}
</script>

<style lang="scss">
.admin-gallery-folder-list {
  margin-top: 3rem;

  &__title {
    margin: 0 0 3.5rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;
    transform: rotate(-5deg);
    display: inline-block;

    @include respond-to(tablet) {
      font-size: 4rem;
    }
  }

  &__message {
    color: $color-text-dark;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }

  &__items {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0;
    padding: 0;

    @include respond-to(desktop) {
      grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    background-color: $color-background-soft;
    @include doodle-frame;
  }

  &__item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__item-name {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__item-details {
    margin: 0.25rem 0 0;
    font-size: 0.95rem;
    color: $color-text-dark;
  }

  &__item-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__photos-toggle,
  &__upload {
    flex-shrink: 0;
    padding: 0.4rem 0.75rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-primary;
      color: $color-background;
    }
  }

  &__delete {
    flex-shrink: 0;
    padding: 0.4rem 1rem;
    border: 2px solid $color-error;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-error;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-error;
      color: $color-background;
    }
  }

  &__photos {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1rem;
    margin: 0;
    padding: 0.75rem 0 0;
  }

  &__photos-empty {
    color: $color-text-dark;
    font-size: 0.9rem;
  }

  &__photo {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.5rem;
    background-color: $color-background;
    border-radius: 0.75rem;
  }

  &__photo-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 0.5rem;
  }

  &__photo-caption {
    margin: 0;
    font-size: 0.8rem;
    color: $color-text-dark;
  }

  &__photo-cover-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    background-color: $color-accent-yellow;
    color: $color-text-dark;
    font-size: 0.7rem;
    font-weight: 700;
  }

  &__photo-actions {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__photo-cover,
  &__photo-delete {
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  &__photo-cover {
    border: 1px solid $color-primary;
    background-color: transparent;
    color: $color-primary;

    &:hover,
    &:focus-visible {
      background-color: $color-primary;
      color: $color-background;
    }
  }

  &__photo-delete {
    border: 1px solid $color-error;
    background-color: transparent;
    color: $color-error;

    &:hover,
    &:focus-visible {
      background-color: $color-error;
      color: $color-background;
    }
  }
}
</style>
