<template>
  <form class="student-material-upload-form" novalidate @submit.prevent="handleSubmit">
    <h2 class="student-material-upload-form__title">Subir PDF a {{ studentName }}</h2>

    <div class="student-material-upload-form__field">
      <label class="student-material-upload-form__label" for="student-material-files">
        Archivos PDF (puedes seleccionar varios a la vez)
      </label>
      <input
        id="student-material-files"
        class="student-material-upload-form__input"
        type="file"
        accept="application/pdf"
        multiple
        :aria-invalid="Boolean(fileError)"
        :aria-describedby="fileError ? 'student-material-files-error' : undefined"
        @change="handleFileChange"
      />
      <p
        v-if="fileError"
        id="student-material-files-error"
        class="student-material-upload-form__field-error"
      >
        {{ fileError }}
      </p>
    </div>

    <ul v-if="entries.length > 0" class="student-material-upload-form__entries">
      <li
        v-for="(entry, index) in entries"
        :key="entry.id"
        class="student-material-upload-form__entry"
      >
        <p class="student-material-upload-form__entry-filename">{{ entry.file.name }}</p>

        <div class="student-material-upload-form__field">
          <label
            class="student-material-upload-form__label"
            :for="`student-material-title-${entry.id}`"
          >
            Título
          </label>
          <input
            :id="`student-material-title-${entry.id}`"
            v-model.trim="entry.title"
            class="student-material-upload-form__input"
            type="text"
            placeholder="Ej. Tarea de Lengua"
            :aria-invalid="Boolean(entry.titleError)"
            :aria-describedby="entry.titleError ? `student-material-title-${entry.id}-error` : undefined"
          />
          <p
            v-if="entry.titleError"
            :id="`student-material-title-${entry.id}-error`"
            class="student-material-upload-form__field-error"
          >
            {{ entry.titleError }}
          </p>
        </div>

        <div class="student-material-upload-form__field">
          <label
            class="student-material-upload-form__label"
            :for="`student-material-description-${entry.id}`"
          >
            Descripción (opcional)
          </label>
          <textarea
            :id="`student-material-description-${entry.id}`"
            v-model.trim="entry.description"
            class="student-material-upload-form__textarea"
            rows="2"
            placeholder="Ej. Resuelve los ejercicios 3 y 4"
          ></textarea>
        </div>

        <button
          type="button"
          class="student-material-upload-form__remove"
          :aria-label="`Quitar ${entry.file.name}`"
          @click="removeEntry(index)"
        >
          Quitar
        </button>
      </li>
    </ul>

    <div class="student-material-upload-form__actions">
      <button
        type="button"
        class="student-material-upload-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        class="student-material-upload-form__submit"
        type="submit"
        :disabled="status === 'submitting' || entries.length === 0"
      >
        {{ status === 'submitting' ? 'Subiendo…' : 'Subir archivo' + (entries.length > 1 ? 's' : '') }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="student-material-upload-form__message student-material-upload-form__message--error"
      role="alert"
    >
      No hemos podido subir todos los archivos. Los que se subieron correctamente ya aparecen en
      el listado; vuelve a intentarlo con el resto.
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { uploadStudentMaterial } from '@/services/materials'

const props = defineProps({
  // Alumno al que se le están subiendo los PDF
  studentId: {
    type: Number,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
})

// material-uploaded se emite una vez por cada PDF que se sube correctamente
// (para reflejarlo en el panel al instante), y all-uploaded solo cuando el
// lote completo termina sin ningún error
const emit = defineEmits(['material-uploaded', 'all-uploaded', 'cancel'])

// A diferencia de la galería (donde el pie de foto solo tiene sentido si se
// sube un único archivo), aquí cada PDF necesita su propio título siempre,
// aunque se suban varios a la vez: por eso "entries" guarda un título y una
// descripción independientes por cada archivo seleccionado
const entries = ref([])
const fileError = ref('')

// idle | submitting | error
const status = ref('idle')

// Identificador incremental para la "key" de cada entrada en la lista, ya
// que el propio objeto File no sirve como key estable entre renders
let nextEntryId = 0

function handleFileChange(event) {
  const files = Array.from(event.target.files)

  entries.value = files.map((file) => ({
    id: nextEntryId++,
    file,
    title: '',
    description: '',
    titleError: '',
  }))
  fileError.value = ''
}

function removeEntry(index) {
  entries.value.splice(index, 1)
}

function validate() {
  if (entries.value.length === 0) {
    fileError.value = 'Selecciona al menos un archivo PDF'
    return false
  }

  fileError.value = ''

  let isValid = true

  for (const entry of entries.value) {
    entry.titleError = entry.title ? '' : 'Escribe un título para este PDF'

    if (entry.titleError) {
      isValid = false
    }
  }

  return isValid
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  // Se suben uno a uno, en orden: si uno falla, los anteriores ya subidos
  // se avisan igualmente al padre (material-uploaded) para no perder ese
  // progreso, y se detiene el resto del lote (mismo criterio que
  // GalleryPhotoUploadForm)
  for (const entry of entries.value) {
    try {
      const response = await uploadStudentMaterial({
        file: entry.file,
        title: entry.title,
        description: entry.description,
        studentId: props.studentId,
      })
      emit('material-uploaded', response.data)
    } catch {
      status.value = 'error'
      return
    }
  }

  status.value = 'idle'
  entries.value = []
  emit('all-uploaded')
}
</script>

<style lang="scss">
.student-material-upload-form {
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

  &__input,
  &__textarea {
    padding: 0.6rem 1rem;
    border: 2px solid $color-text-dark;
    border-radius: 0.75rem;
    font: inherit;

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__textarea {
    resize: vertical;
  }

  &__field-error {
    margin: 0;
    font-size: 0.875rem;
    color: $color-error;
  }

  &__entries {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin: 0;
    padding: 0;
  }

  &__entry {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background-color: $color-background-soft;
    border-radius: 0.75rem;
  }

  &__entry-filename {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-dark;
    word-break: break-all;
  }

  &__remove {
    align-self: flex-end;
    padding: 0.3rem 0.9rem;
    border: 1px solid $color-error;
    border-radius: 999px;
    background: none;
    color: $color-error;
    font-size: 0.8125rem;
    font-weight: 600;
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
