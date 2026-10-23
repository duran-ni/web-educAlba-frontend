<template>
  <article class="my-material-row">
    <div class="my-material-row__info">
      <div class="my-material-row__title-row">
        <a
          :href="material.downloadUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="my-material-row__link"
        >
          <span class="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span>
          {{ material.title }}
        </a>

        <span class="my-material-row__separator" aria-hidden="true">·</span>

        <span class="my-material-row__size">{{ formattedSize }}</span>
      </div>

      <p v-if="material.description" class="my-material-row__description">
        {{ material.description }}
      </p>
    </div>

    <a
      :href="material.downloadUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="my-material-row__download"
      :aria-label="`Descargar ${material.title}`"
    >
      Descargar
    </a>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatFileSize } from '@/utils/formatFileSize'

const props = defineProps({
  // Material tal como lo devuelve /api/dashboard/my-materials (MaterialResponse
  // en el backend): id, title, description, fileUrl, downloadUrl,
  // fileSizeBytes, uploadedAt, studentId, studentFullName
  material: {
    type: Object,
    required: true,
  },
})

const formattedSize = computed(() => formatFileSize(props.material.fileSizeBytes))
</script>

<style lang="scss">
.my-material-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.25rem 1.5rem;
  background-color: $color-background-highlight;
  @include doodle-frame;

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  &__title-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $color-primary;
    font-family: $font-heading;
    font-weight: 600;
    word-break: break-word;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__separator {
    color: $color-text-dark;
    opacity: 0.4;
  }

  &__size {
    font-size: 0.8125rem;
    color: $color-text-dark;
    opacity: 0.75;
    white-space: nowrap;
  }

  &__description {
    margin: 0;
    font-size: 0.875rem;
    color: $color-text-dark;
  }

  // "flex-shrink: 0" evita que el boton se comprima cuando el titulo o la
  // descripcion ocupan mucho espacio en la misma fila
  &__download {
    flex-shrink: 0;
    padding: 0.5rem 1.3rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.875rem;
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
}
</style>
