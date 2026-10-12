<template>
  <figure class="gallery-photo-card">
    <img class="gallery-photo-card__image" :src="photo.imageUrl" :alt="altText" loading="lazy" />
    <figcaption v-if="photo.caption" class="gallery-photo-card__caption">
      {{ photo.caption }}
    </figcaption>
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

// Si el administrador no ha escrito un pie de foto, usamos un texto
// alternativo genérico para que el lector de pantalla no se quede sin
// descripción de la imagen (accesibilidad)
const altText = computed(() => props.photo.caption || 'Foto de la galería de Academia EducAlba')
</script>

<style lang="scss">
.gallery-photo-card {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

  &__caption {
    margin: 0;
    text-align: center;
    font-family: $font-heading;
    font-size: 0.9rem;
    color: $color-primary;
  }
}
</style>
