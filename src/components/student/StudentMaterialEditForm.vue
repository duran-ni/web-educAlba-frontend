<template>
  <form class="student-material-edit-form" novalidate @submit.prevent="handleSubmit">
    <h2 class="student-material-edit-form__title">Editar material</h2>

    <div class="student-material-edit-form__field">
      <label class="student-material-edit-form__label" for="student-material-edit-title">
        Título
      </label>
      <input
        id="student-material-edit-title"
        v-model.trim="title"
        class="student-material-edit-form__input"
        type="text"
        :aria-invalid="Boolean(titleError)"
        :aria-describedby="titleError ? 'student-material-edit-title-error' : undefined"
      />
      <p
        v-if="titleError"
        id="student-material-edit-title-error"
        class="student-material-edit-form__field-error"
      >
        {{ titleError }}
      </p>
    </div>

    <div class="student-material-edit-form__field">
      <label class="student-material-edit-form__label" for="student-material-edit-description">
        Descripción (opcional)
      </label>
      <textarea
        id="student-material-edit-description"
        v-model.trim="description"
        class="student-material-edit-form__textarea"
        rows="2"
      ></textarea>
    </div>

    <div class="student-material-edit-form__actions">
      <button
        type="button"
        class="student-material-edit-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button
        class="student-material-edit-form__submit"
        type="submit"
        :disabled="status === 'submitting'"
      >
        {{ status === 'submitting' ? 'Guardando…' : 'Guardar cambios' }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="student-material-edit-form__message student-material-edit-form__message--error"
      role="alert"
    >
      No hemos podido actualizar el material. Inténtalo de nuevo en unos minutos.
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { updateStudentMaterial } from '@/services/materials'

const props = defineProps({
  // Material cuyo título/descripción se va a editar (tal como lo devuelve el backend)
  material: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updated', 'cancel'])

// Se parte de los valores actuales, para que el administrador/a solo tenga
// que corregir el texto en vez de escribirlo de cero
const title = ref(props.material.title ?? '')
const description = ref(props.material.description ?? '')
const titleError = ref('')

// idle | submitting | error
const status = ref('idle')

function validate() {
  titleError.value = title.value ? '' : 'Escribe un título para este PDF'
  return !titleError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    const response = await updateStudentMaterial(props.material.id, {
      title: title.value,
      description: description.value,
    })
    status.value = 'idle'
    emit('updated', response.data)
  } catch {
    status.value = 'error'
  }
}
</script>

<style lang="scss">
.student-material-edit-form {
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
