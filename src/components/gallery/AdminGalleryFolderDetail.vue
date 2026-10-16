<template>
  <section class="admin-gallery-folder-detail">
    <button type="button" class="admin-gallery-folder-detail__back" @click="$emit('back')">
      ← Volver a carpetas
    </button>

    <div class="admin-gallery-folder-detail__header">
      <h2 class="admin-gallery-folder-detail__title">{{ folder.name }}</h2>

      <div class="admin-gallery-folder-detail__header-actions">
        <button
          type="button"
          class="admin-gallery-folder-detail__upload"
          @click="$emit('upload-photo', folder)"
        >
          Subir archivo
        </button>

        <button
          type="button"
          class="admin-gallery-folder-detail__delete-folder"
          @click="handleDeleteFolderClick"
        >
          Eliminar carpeta
        </button>
      </div>
    </div>

    <p v-if="photos.length === 0" class="admin-gallery-folder-detail__empty">
      Esta carpeta todavía no tiene fotos.
    </p>

    <ul v-else class="admin-gallery-folder-detail__photos">
      <li v-for="photo in photos" :key="photo.id" class="admin-gallery-folder-detail__photo">
        <video
          v-if="photo.mediaType === 'VIDEO'"
          class="admin-gallery-folder-detail__photo-image"
          :src="photo.imageUrl"
          :aria-label="photo.caption || 'Vídeo de la galería'"
          controls
          playsinline
          preload="metadata"
        ></video>
        <img
          v-else
          class="admin-gallery-folder-detail__photo-image"
          :src="photo.imageUrl"
          :alt="photo.caption || ''"
          loading="lazy"
        />

        <p v-if="photo.caption" class="admin-gallery-folder-detail__photo-caption">
          {{ photo.caption }}
        </p>

        <span
          v-if="folder.coverPhotoId === photo.id"
          class="admin-gallery-folder-detail__photo-cover-badge"
        >
          Portada
        </span>

        <div class="admin-gallery-folder-detail__photo-actions">
          <button
            v-if="folder.coverPhotoId !== photo.id"
            type="button"
            class="admin-gallery-folder-detail__photo-cover"
            @click="$emit('set-cover', { folderId: folder.id, photoId: photo.id })"
          >
            Marcar como portada
          </button>

          <button
            type="button"
            class="admin-gallery-folder-detail__photo-edit"
            @click="$emit('edit-caption', photo)"
          >
            Editar pie de foto
          </button>

          <button
            type="button"
            class="admin-gallery-folder-detail__photo-delete"
            @click="handleDeletePhotoClick(photo)"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  // Carpeta seleccionada que se está gestionando (id, name, photoCount, coverPhotoId)
  folder: {
    type: Object,
    required: true,
  },
  // Fotos de esta carpeta, ya filtradas por el componente padre
  photos: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'back',
  'upload-photo',
  'delete-folder',
  'set-cover',
  'delete-photo',
  'edit-caption',
])

// Pide confirmación antes de avisar al componente padre, para evitar que
// un clic accidental borre la carpeta sin darse cuenta
function handleDeleteFolderClick() {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar la carpeta "${props.folder.name}"? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete-folder', props.folder.id)
  }
}

// Pide confirmación antes de eliminar una foto en concreto
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
.admin-gallery-folder-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__back {
    align-self: flex-start;
    padding: 0.4rem 0;
    border: none;
    background: none;
    color: $color-text-dark;
    font-family: $font-heading;
    font-weight: 600;
    font-size: 1.3rem;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.75rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__upload {
    padding: 0.55rem 1.3rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.95rem;
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

  &__delete-folder {
    padding: 0.55rem 1.3rem;
    border: 2px solid $color-error;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-error;
    font-family: $font-heading;
    font-size: 0.95rem;
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

  &__empty {
    color: $color-text-dark;
  }

  &__photos {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, 14rem);
    gap: 1rem;
    margin: 0;
    padding: 0;
  }

  &__photo {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.5rem;
    background-color: $color-background-soft;
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
  &__photo-edit,
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

  &__photo-cover,
  &__photo-edit {
    border: 1px solid $color-green-dark;
    background-color: transparent;
    color: $color-green-dark;

    &:hover,
    &:focus-visible {
      background-color: $color-green-dark;
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
