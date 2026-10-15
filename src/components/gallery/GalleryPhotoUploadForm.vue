<template>
  <form class="gallery-photo-upload-form" novalidate @submit.prevent="handleSubmit">
    <h2 class="gallery-photo-upload-form__title">Subir foto a "{{ folderName }}"</h2>

    <div class="gallery-photo-upload-form__field">
      <label class="gallery-photo-upload-form__label" for="gallery-photo-image">Fotografía</label>
      <input
        id="gallery-photo-image"
        class="gallery-photo-upload-form__input"
        type="file"
        accept="image/*"
        :aria-invalid="Boolean(imageError)"
        :aria-describedby="imageError ? 'gallery-photo-image-error' : undefined"
        @change="handleFileChange"
      />
      <p
        v-if="imageError"
        id="gallery-photo-image-error"
        class="gallery-photo-upload-form__field-error"
      >
        {{ imageError }}
      </p>
    </div>

    <div class="gallery-photo-upload-form__field">
      <label class="gallery-photo-upload-form__label" for="gallery-photo-caption">
        Pie de foto (opcional)
      </label>
      <input
        id="gallery-photo-caption"
        v-model.trim="caption"
        class="gallery-photo-upload-form__input"
        type="text"
        placeholder="Ej. Clase de robótica"
      />
    </div>

    <div class="gallery-photo-upload-form__actions">
      <button
        type="button"
        class="gallery-photo-upload-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        class="gallery-photo-upload-form__submit"
        type="submit"
        :disabled="status === 'submitting'"
      >
        {{ status === 'submitting' ? 'Subiendo…' : 'Subir foto' }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="gallery-photo-upload-form__message gallery-photo-upload-form__message--error"
      role="alert"
    >
      No hemos podido subir la foto. Inténtalo de nuevo en unos minutos.
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { uploadGalleryPhoto } from '@/services/gallery'

const props = defineProps({
  folderId: {
    type: Number,
    required: true,
  },
  folderName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['uploaded', 'cancel'])

const image = ref(null)
const caption = ref('')
const imageError = ref('')

// idle | submitting | error
const status = ref('idle')

// El navegador entrega el fichero elegido en event.target.files (un
// FileList, aunque aqui solo se permite seleccionar uno): se guarda el
// primero (o null si el usuario borra la seleccion)
function handleFileChange(event) {
  image.value = event.target.files[0] ?? null
}

function validate() {
  imageError.value = image.value ? '' : 'Selecciona una fotografía'
  return !imageError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    const response = await uploadGalleryPhoto({
      image: image.value,
      caption: caption.value,
      folderId: props.folderId,
    })
    status.value = 'idle'
    emit('uploaded', response.data)
  } catch {
    status.value = 'error'
  }
}
</script>

<style lang="scss">
.gallery-photo-upload-form {
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
