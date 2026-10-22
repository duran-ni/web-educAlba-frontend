<template>
  <figure class="gallery-photo-card">
    <video
      v-if="photo.mediaType === 'VIDEO'"
      class="gallery-photo-card__image"
      :src="photo.imageUrl"
      controls
      controlsList="nodownload noremoteplayback"
      disablePictureInPicture
      preload="metadata"
      :aria-label="altText"
      @contextmenu.prevent
    ></video>
    <img
      v-else
      class="gallery-photo-card__image"
      :src="photo.imageUrl"
      :alt="altText"
      loading="lazy"
    />
  </figure>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Foto de la galería a mostrar (tal como la devuelve el backend)
  photo: {
    type: Object,
    required: true,
  },
})

// El caption ya no se muestra en pantalla, pero se sigue usando como texto
// alternativo de la imagen (o como etiqueta accesible del video) para que no
// se pierda la descripcion de accesibilidad
const altText = computed(() => props.photo.caption || 'Foto de la galería de Academia EducAlba')
</script>

<style lang="scss">
.gallery-photo-card {
  margin: 0;
  padding: 1rem;
  background-color: $color-background-highlight;
  @include doodle-frame;

  &:nth-child(odd) {
    transform: rotate(1deg);
  }

  &:nth-child(even) {
    transform: rotate(-1deg);
  }

  &__image {
    display: block;
    width: 100%;
    height: 14rem;
    object-fit: cover;
    border-radius: 12px;

    @include respond-to(tablet) {
      height: 16rem;
    }

    @include respond-to(desktop) {
      height: 18rem;
    }
  }
}
</style>
