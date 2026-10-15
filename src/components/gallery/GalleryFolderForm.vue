<template>
  <form class="gallery-folder-form" novalidate @submit.prevent="handleSubmit">
    <h2 class="gallery-folder-form__title">Nueva carpeta</h2>

    <div class="gallery-folder-form__field">
      <label class="gallery-folder-form__label" for="gallery-folder-name">Nombre</label>
      <input
        id="gallery-folder-name"
        v-model.trim="name"
        class="gallery-folder-form__input"
        type="text"
        placeholder="Ej. Taller de robótica"
        :aria-invalid="Boolean(nameError)"
        :aria-describedby="nameError ? 'gallery-folder-name-error' : undefined"
      />
      <p v-if="nameError" id="gallery-folder-name-error" class="gallery-folder-form__field-error">
        {{ nameError }}
      </p>
    </div>

    <div class="gallery-folder-form__actions">
      <button
        type="button"
        class="gallery-folder-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button class="gallery-folder-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Guardando…' : 'Guardar carpeta' }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="gallery-folder-form__message gallery-folder-form__message--error"
      role="alert"
    >
      No hemos podido guardar la carpeta. Inténtalo de nuevo en unos minutos.
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { createGalleryFolder } from '@/services/gallery'

const emit = defineEmits(['created', 'cancel'])

const name = ref('')
const nameError = ref('')

// idle | submitting | error
const status = ref('idle')

function validate() {
  nameError.value = name.value ? '' : 'Escribe el nombre de la carpeta'
  return !nameError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    const response = await createGalleryFolder({ name: name.value })
    status.value = 'idle'
    emit('created', response.data)
  } catch {
    status.value = 'error'
  }
}
</script>

<style lang="scss">
.gallery-folder-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__title {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    color: $color-primary;
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

  &__field-error {
    margin: 0;
    font-size: 0.875rem;
    color: $color-error;
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
