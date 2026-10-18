<template>
  <form class="teacher-form" novalidate @submit.prevent="handleSubmit">
    <div class="teacher-form__heading">
      <h2 class="teacher-form__title">{{ isEditing ? 'Editar profesor' : 'Nuevo profesor' }}</h2>
    </div>

    <div class="teacher-form__field">
      <label class="teacher-form__label" for="teacher-name">Nombre</label>
      <input
        id="teacher-name"
        v-model.trim="name"
        class="teacher-form__input"
        type="text"
        placeholder="Ej. Laura Gómez"
        :aria-invalid="Boolean(nameError)"
        :aria-describedby="nameError ? 'teacher-name-error' : undefined"
      />
      <p v-if="nameError" id="teacher-name-error" class="teacher-form__field-error">
        {{ nameError }}
      </p>
    </div>

    <div class="teacher-form__field">
      <label class="teacher-form__label" for="teacher-specialty">Especialidad</label>
      <input
        id="teacher-specialty"
        v-model.trim="specialty"
        class="teacher-form__input"
        type="text"
        placeholder="Ej. Matemáticas"
        :aria-invalid="Boolean(specialtyError)"
        :aria-describedby="specialtyError ? 'teacher-specialty-error' : undefined"
      />
      <p v-if="specialtyError" id="teacher-specialty-error" class="teacher-form__field-error">
        {{ specialtyError }}
      </p>
    </div>

    <div class="teacher-form__field">
      <label class="teacher-form__label" for="teacher-photo">Foto (opcional)</label>
      <img
        v-if="photoPreviewUrl"
        :src="photoPreviewUrl"
        class="teacher-form__preview"
        alt="Vista previa de la foto del profesor"
      />
      <input
        id="teacher-photo"
        class="teacher-form__input"
        type="file"
        accept="image/*"
        @change="handlePhotoChange"
      />
    </div>

    <div class="teacher-form__actions">
      <button
        type="button"
        class="teacher-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button class="teacher-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ submitButtonLabel }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="teacher-form__message teacher-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>

    <p
      v-if="status === 'photo-error'"
      class="teacher-form__message teacher-form__message--error"
      role="alert"
    >
      El profesor se ha guardado, pero no hemos podido subir la foto. Puedes volver a intentarlo
      editándolo de nuevo.
    </p>
  </form>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { createTeacher, updateTeacher, uploadTeacherPhoto } from '@/services/teachers'

// Si se recibe un profesor por prop, el formulario entra en modo edición:
// precarga sus datos y, al guardar, actualiza en vez de crear. El
// componente padre es responsable de volver a crear este formulario
// (con :key) cada vez que cambia el profesor a editar, para que los
// campos se recarguen limpios
const props = defineProps({
  teacher: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['created', 'updated', 'cancel'])

const isEditing = computed(() => props.teacher !== null)

const name = ref(props.teacher?.name ?? '')
const specialty = ref(props.teacher?.specialty ?? '')

// Archivo seleccionado (null si no se ha elegido ninguno nuevo) y la URL
// que se usa para previsualizarlo: al editar, empieza mostrando la foto
// que ya tenía el profesor (si tiene); al elegir un archivo nuevo, pasa a
// mostrar una vista previa generada en el propio navegador
const photo = ref(null)
const photoPreviewUrl = ref(props.teacher?.photoUrl ?? null)

const nameError = ref('')
const specialtyError = ref('')

// idle | submitting | error | photo-error
const status = ref('idle')
const submitErrorMessage = ref('')

const submitButtonLabel = computed(() => {
  if (status.value === 'submitting') {
    return 'Guardando…'
  }

  return isEditing.value ? 'Guardar cambios' : 'Guardar profesor'
})

function validate() {
  nameError.value = name.value ? '' : 'Escribe el nombre del profesor'
  specialtyError.value = specialty.value ? '' : 'Escribe la especialidad'

  return !nameError.value && !specialtyError.value
}

// El navegador entrega el fichero elegido en event.target.files (un
// FileList); con un input sin "multiple" solo nos interesa el primero
function handlePhotoChange(event) {
  const file = event.target.files[0] ?? null
  photo.value = file

  // Si ya había una vista previa generada en el navegador (no la URL real
  // que vino del backend), hay que liberarla antes de crear la siguiente,
  // para no acumular memoria sin usar
  if (photoPreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreviewUrl.value)
  }

  photoPreviewUrl.value = file ? URL.createObjectURL(file) : (props.teacher?.photoUrl ?? null)
}

// Libera la vista previa generada en el navegador si el componente se
// destruye antes de guardar (p. ej. al cancelar), para no dejarla en memoria
onBeforeUnmount(() => {
  if (photoPreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreviewUrl.value)
  }
})

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  const payload = {
    name: name.value,
    specialty: specialty.value,
  }

  let teacherData
  const eventName = isEditing.value ? 'updated' : 'created'

  try {
    const response = isEditing.value
      ? await updateTeacher(props.teacher.id, payload)
      : await createTeacher(payload)
    teacherData = response.data
  } catch {
    status.value = 'error'
    submitErrorMessage.value = isEditing.value
      ? 'No hemos podido guardar los cambios. Inténtalo de nuevo en unos minutos.'
      : 'No hemos podido guardar el profesor. Inténtalo de nuevo en unos minutos.'
    return
  }

  // El profesor (nombre/especialidad) ya se ha guardado en este punto.
  // Si hay una foto seleccionada, se sube en un segundo paso, aparte,
  // para no complicar el endpoint de creacion/edicion con datos binarios
  if (photo.value) {
    try {
      const photoResponse = await uploadTeacherPhoto(teacherData.id, photo.value)
      teacherData = photoResponse.data
    } catch {
      status.value = 'photo-error'
      emit(eventName, teacherData, { photoFailed: true })
      return
    }
  }

  status.value = 'idle'
  emit(eventName, teacherData)
}
</script>

<style lang="scss">
.teacher-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem;

  &__heading {
    text-align: center;
  }

  &__title {
    margin: 0;
    font-family: $font-doodle;
    font-size: 1.75rem;
    color: $color-primary;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    font-family: $font-heading;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-dark;
  }

  &__input {
    padding: 0.75rem 1rem;
    background-color: $color-background;
    border: 2px dashed $color-text-dark;
    border-radius: 0.5rem;
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;

    &:focus-visible {
      outline: none;
      border-color: $color-primary;
    }
  }

  &__preview {
    width: 6rem;
    height: 6rem;
    align-self: flex-start;
    object-fit: cover;
    border: 2px solid $color-text-dark;
    border-radius: 0.5rem;
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  &__cancel {
    padding: 0.75rem 1.25rem;
    background: none;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    font-family: $font-heading;
    font-weight: 600;
    color: $color-text-dark;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__submit {
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-background;
    font-family: $font-heading;
    font-weight: 600;
    box-shadow: 4px 4px 0 0 $color-text-dark;
    transition: opacity 0.2s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      opacity: 0.9;
    }
  }

  &__message {
    margin: 0;
    font-weight: 600;
    text-align: center;
  }

  &__message--error {
    color: $color-error;
  }
}
</style>
