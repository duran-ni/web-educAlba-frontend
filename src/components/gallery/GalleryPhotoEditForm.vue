<template>
  <form class="gallery-photo-edit-form" novalidate @submit.prevent="handleSubmit">
    <h2 class="gallery-photo-edit-form__title">Editar pie de foto</h2>

    <img class="gallery-photo-edit-form__preview" :src="photo.imageUrl" alt="" aria-hidden="true" />

    <div class="gallery-photo-edit-form__field">
      <label class="gallery-photo-edit-form__label" for="gallery-photo-edit-caption">
        Pie de foto
      </label>
      <input
        id="gallery-photo-edit-caption"
        v-model.trim="caption"
        class="gallery-photo-edit-form__input"
        type="text"
        placeholder="Ej. Clase de robótica"
      />
    </div>

    <div class="gallery-photo-edit-form__actions">
      <button
        type="button"
        class="gallery-photo-edit-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button class="gallery-photo-edit-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="gallery-photo-edit-form__message gallery-photo-edit-form__message--error"
      role="alert"
    >
      No hemos podido actualizar el pie de foto. Inténtalo de nuevo en unos minutos.
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { updateGalleryPhotoCaption } from '@/services/gallery'

const props = defineProps({
  // Foto cuyo pie de foto se va a editar (tal como la devuelve el backend)
  photo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updated', 'cancel'])

// Se parte del pie de foto actual, para que el administrador/a solo tenga
// que corregir el texto en vez de escribirlo de cero
const caption = ref(props.photo.caption ?? '')

// idle | submitting | error
const status = ref('idle')

async function handleSubmit() {
  status.value = 'submitting'

  try {
    const response = await updateGalleryPhotoCaption(props.photo.id, caption.value)
    status.value = 'idle'
    emit('updated', response.data)
  } catch {
    status.value = 'error'
  }
}
</script>

<style lang="scss">
.gallery-photo-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $color-primary;
  }

  &__preview {
    width: 100%;
    max-height: 12rem;
    object-fit: cover;
    border-radius: 0.75rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__label {
    font-family: $font-heading;
    font-size: 1rem;
    font-weight: 600;
    color: $color-text-dark;
  }

  &__input {
    padding: 0.6rem 1rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    font: inherit;

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  &__cancel,
  &__submit {
    padding: 0.6rem 1.5rem;
    border-radius: 999px;
    font-family: $font-heading;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__cancel {
    border: 2px solid $color-text-dark;
    background: none;
    color: $color-text-dark;
  }

  &__submit {
    border: none;
    background-color: $color-primary;
    color: $color-background;
  }

  &__message {
    margin: 0;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }
}
</style>
