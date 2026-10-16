<template>
  <RouterLink
    class="gallery-folder-card"
    :to="{ name: 'gallery-folder', params: { folderId: folder.id } }"
  >
    <div class="gallery-folder-card__tab" aria-hidden="true"></div>

    <div class="gallery-folder-card__body">
      <img
        v-if="secondPhoto"
        class="gallery-folder-card__image gallery-folder-card__image--back"
        :src="secondPreviewUrl"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <img
        v-if="coverPhoto"
        class="gallery-folder-card__image gallery-folder-card__image--front"
        :src="coverPreviewUrl"
        :alt="`Portada de la carpeta ${folder.name}`"
        loading="lazy"
      />
    </div>

    <span class="gallery-folder-card__name">{{ folder.name }}</span>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  // Carpeta de la galería a mostrar como tarjeta: { id, name, photos }
  folder: {
    type: Object,
    required: true,
  },
})

// Las dos fotos mas recientes de la carpeta: el backend ya las devuelve
// ordenadas de mas reciente a mas antigua, asi que basta con las dos primeras
const coverPhoto = computed(() => props.folder.photos[0] ?? null)
const secondPhoto = computed(() => props.folder.photos[1] ?? null)

// Si el elemento es un video, no lo reproducimos en la rejilla publica (seria
// muy pesado y se autorreproducirian varios videos a la vez sin que el
// usuario lo pida). En su lugar, pedimos a Cloudinary una previsualizacion
// estatica del video cambiando la extension del archivo por ".jpg": Cloudinary
// genera automaticamente una imagen a partir del primer fotograma del video
function toPreviewUrl(photo) {
  if (!photo) return null
  if (photo.mediaType !== 'VIDEO') return photo.imageUrl
  return photo.imageUrl.replace(/\.\w+$/, '.jpg')
}

const coverPreviewUrl = computed(() => toPreviewUrl(coverPhoto.value))
const secondPreviewUrl = computed(() => toPreviewUrl(secondPhoto.value))
</script>

<style lang="scss">
.gallery-folder-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.25rem;
  text-decoration: none;
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

    .gallery-folder-card__body {
      box-shadow: 0 1.5rem 2rem rgba(0, 0, 0, 0.25);
    }

    .gallery-folder-card__image--front {
      transform: translate(-58%, -45%) rotate(0deg) scale(1.05);
    }

    .gallery-folder-card__image--back {
      transform: translate(-38%, -58%) rotate(10deg);
    }
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
    height: 14rem;
    background-color: $color-accent-yellow-soft;
    border-radius: 4px 16px 16px 16px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.16);
    transition: box-shadow 0.25s ease;

    @include respond-to(tablet) {
      height: 16rem;
    }

    @include respond-to(desktop) {
      height: 18rem;
    }
  }

  // Las dos fotos se centran sobre el cuerpo (top/left: 50%) y cada una se
  // desplaza y gira hacia un lado distinto con "translate", dando el efecto
  // de dos fotografias superpuestas en cascada, como si estuvieran sueltas
  // dentro de la carpeta
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
    text-align: center;
    font-family: $font-heading;
    font-size: 1.1rem;
    font-weight: 700;
    color: $color-primary;
  }
}
</style>
