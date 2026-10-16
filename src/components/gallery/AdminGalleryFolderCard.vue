<template>
  <button
    type="button"
    class="admin-gallery-folder-card"
    :aria-label="`Gestionar la carpeta ${folder.name}`"
    @click="$emit('select', folder.id)"
  >
    <div class="admin-gallery-folder-card__tab" aria-hidden="true"></div>

    <div class="admin-gallery-folder-card__body">
      <video
        v-if="secondPhoto && secondPhoto.mediaType === 'VIDEO'"
        class="admin-gallery-folder-card__image admin-gallery-folder-card__image--back"
        :src="secondPhoto.imageUrl"
        muted
        preload="metadata"
        aria-hidden="true"
      ></video>
      <img
        v-else-if="secondPhoto"
        class="admin-gallery-folder-card__image admin-gallery-folder-card__image--back"
        :src="secondPhoto.imageUrl"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <video
        v-if="coverPhoto && coverPhoto.mediaType === 'VIDEO'"
        class="admin-gallery-folder-card__image admin-gallery-folder-card__image--front"
        :src="coverPhoto.imageUrl"
        muted
        preload="metadata"
        aria-hidden="true"
      ></video>
      <img
        v-else-if="coverPhoto"
        class="admin-gallery-folder-card__image admin-gallery-folder-card__image--front"
        :src="coverPhoto.imageUrl"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
    </div>

    <span class="admin-gallery-folder-card__name">{{ folder.name }}</span>
    <span class="admin-gallery-folder-card__count">
      {{ folder.photoCount }} foto{{ folder.photoCount === 1 ? '' : 's' }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Carpeta de la galería a mostrar como tarjeta (tal como la devuelve el
  // backend para el panel de administración: id, name, photoCount, coverPhotoId)
  folder: {
    type: Object,
    required: true,
  },
  // Fotos de esta carpeta en concreto (ya filtradas por el componente padre),
  // ordenadas de la más reciente a la más antigua
  photos: {
    type: Array,
    required: true,
  },
})

defineEmits(['select'])

// La portada es la foto marcada como tal; si todavía no hay ninguna marcada,
// se usa la más reciente como alternativa provisional
const coverPhoto = computed(
  () =>
    props.photos.find((photo) => photo.id === props.folder.coverPhotoId) ?? props.photos[0] ?? null
)

// La segunda foto visible es cualquier otra distinta de la portada, solo
// para dar el efecto visual de "varias fotos dentro de la carpeta"
const secondPhoto = computed(
  () => props.photos.find((photo) => photo.id !== coverPhoto.value?.id) ?? null
)
</script>

<style lang="scss">
.admin-gallery-folder-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0.75rem 0.75rem;
  border: none;
  background: none;
  font: inherit;
  cursor: pointer;
  text-align: center;
  width: 100%;
  max-width: 16rem;
  transition: transform 0.25s ease;

  &:nth-child(odd) {
    transform: rotate(1deg);
  }

  &:nth-child(even) {
    transform: rotate(-1deg);
  }

  &:hover,
  &:focus-visible {
    transform: scale(1.06) translateY(-0.6rem);
    z-index: 1;

    .admin-gallery-folder-card__body {
      box-shadow: 0 1.5rem 2rem rgba(0, 0, 0, 0.25);
    }

    .admin-gallery-folder-card__image--front {
      transform: translate(-58%, -45%) rotate(0deg) scale(1.05);
    }

    .admin-gallery-folder-card__image--back {
      transform: translate(-38%, -58%) rotate(10deg);
    }
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 4px;
  }

  &__tab {
    position: absolute;
    top: 0;
    left: 1.5rem;
    width: 40%;
    height: 1.25rem;
    background-color: $color-accent-yellow-soft;
    border-radius: 10px 10px 0 0;
  }

  &__body {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: $color-accent-yellow-soft;
    border-radius: 4px 16px 16px 16px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.16);
    transition: box-shadow 0.25s ease;
  }

  &__image {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 75%;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
    transition: transform 0.25s ease;

    &--back {
      transform: translate(-42%, -55%) rotate(6deg);
      z-index: 1;
    }

    &--front {
      transform: translate(-58%, -45%) rotate(-4deg);
      z-index: 2;
    }
  }

  &__name {
    font-family: $font-heading;
    font-size: 1.1rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__count {
    font-size: 0.85rem;
    color: $color-text-dark;
  }
}
</style>
