<template>
  <form class="gallery-photo-upload-form" novalidate @submit.prevent="handleSubmit">
    <h2 class="gallery-photo-upload-form__title">Subir fotos a "{{ folderName }}"</h2>

    <div class="gallery-photo-upload-form__field">
      <label class="gallery-photo-upload-form__label" for="gallery-photo-image">
        Fotografías (puedes seleccionar varias a la vez)
      </label>
      <input
        id="gallery-photo-image"
        class="gallery-photo-upload-form__input"
        type="file"
        accept="image/*"
        multiple
        :aria-invalid="Boolean(imageError)"
        :aria-describedby="imageError ? 'gallery-photo-image-error' : undefined"
        @change="handleFileChange"
      />
      <p v-if="images.length > 0" class="gallery-photo-upload-form__field-hint">
        {{ images.length }} foto{{ images.length === 1 ? '' : 's' }} seleccionada{{
          images.length === 1 ? '' : 's'
        }}
      </p>
      <p
        v-if="imageError"
        id="gallery-photo-image-error"
        class="gallery-photo-upload-form__field-error"
      >
        {{ imageError }}
      </p>
    </div>

    <div v-if="images.length === 1" class="gallery-photo-upload-form__field">
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

    <p v-else-if="images.length > 1" class="gallery-photo-upload-form__field-hint">
      Al subir varias fotos a la vez no se les añade pie de foto; podrás editarlo después,
      foto a foto, desde la gestión de esta carpeta.
    </p>

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
        {{ status === 'submitting' ? 'Subiendo…' : 'Subir foto' + (images.length > 1 ? 's' : '') }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="gallery-photo-upload-form__message gallery-photo-upload-form__message--error"
      role="alert"
    >
      No hemos podido subir todas las fotos. Las que se subieron correctamente ya aparecen en la
      carpeta; vuelve a intentarlo con el resto.
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

// photo-uploaded se emite una vez por cada foto que se sube correctamente
// (para reflejarla en el panel al instante), y all-uploaded solo cuando
// el lote completo termina sin ningún error
const emit = defineEmits(['photo-uploaded', 'all-uploaded', 'cancel'])

const images = ref([])
const caption = ref('')
const imageError = ref('')

// idle | submitting | error
const status = ref('idle')

// El navegador entrega los ficheros elegidos en event.target.files (un
// FileList); se convierte a array normal para poder recorrerlo fácilmente
function handleFileChange(event) {
  images.value = Array.from(event.target.files)
}

function validate() {
  imageError.value = images.value.length > 0 ? '' : 'Selecciona al menos una fotografía'
  return !imageError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  // El pie de foto solo tiene sentido cuando se sube una única fotografía;
  // al subir varias a la vez, cada una se edita después por separado
  const sharedCaption = images.value.length === 1 ? caption.value : ''

  // Se suben una a una, en orden: si una falla, las anteriores ya subidas
  // se avisan igualmente al padre (photo-uploaded) para no perder ese
  // progreso, y se detiene el resto del lote
  for (const image of images.value) {
    try {
      const response = await uploadGalleryPhoto({
        image,
        caption: sharedCaption,
        folderId: props.folderId,
      })
      emit('photo-uploaded', response.data)
    } catch {
      status.value = 'error'
      return
    }
  }

  status.value = 'idle'
  emit('all-uploaded')
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

  &__field-hint {
    margin: 0;
    font-size: 0.875rem;
    color: $color-text-dark;
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
