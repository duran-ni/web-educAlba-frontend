<template>
  <section class="quick-interest-form">
    <h2 class="quick-interest-form__heading">¡Únete a la clase!</h2>

    <form class="quick-interest-form__form" novalidate @submit.prevent="handleSubmit">
      <div class="quick-interest-form__field">
        <label class="quick-interest-form__label" for="interest-student-name">Nombre del alumno</label>
        <input
          id="interest-student-name"
          v-model.trim="studentName"
          class="quick-interest-form__input"
          type="text"
          placeholder="Ej. Juanito"
          :aria-invalid="Boolean(studentNameError)"
          :aria-describedby="studentNameError ? 'interest-student-name-error' : undefined"
        />
        <p v-if="studentNameError" id="interest-student-name-error" class="quick-interest-form__field-error">
          {{ studentNameError }}
        </p>
      </div>

      <div class="quick-interest-form__field">
        <label class="quick-interest-form__label" for="interest-course">Curso a reforzar</label>
        <input
          id="interest-course"
          v-model.trim="courseToReinforce"
          class="quick-interest-form__input"
          type="text"
          placeholder="Ej. Matemáticas 2º ESO"
          :aria-invalid="Boolean(courseError)"
          :aria-describedby="courseError ? 'interest-course-error' : undefined"
        />
        <p v-if="courseError" id="interest-course-error" class="quick-interest-form__field-error">
          {{ courseError }}
        </p>
      </div>

      <button class="quick-interest-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Enviando…' : 'Me apunto' }}
      </button>

      <p
        v-if="status === 'success'"
        class="quick-interest-form__message quick-interest-form__message--success"
        role="status"
        aria-live="polite"
      >
        ¡Gracias! Hemos recibido tu solicitud, te contactaremos pronto.
      </p>
      <p
        v-else-if="status === 'error'"
        class="quick-interest-form__message quick-interest-form__message--error"
        role="alert"
      >
        {{ submitErrorMessage }}
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { submitInterest } from '@/services/interestSubmissions'

const studentName = ref('')
const courseToReinforce = ref('')
const studentNameError = ref('')
const courseError = ref('')
const status = ref('idle')
const submitErrorMessage = ref('')

// Valida los campos obligatorios en el propio frontend, antes de llamar al backend
function validate() {
  studentNameError.value = studentName.value ? '' : 'Escribe el nombre del alumno'
  courseError.value = courseToReinforce.value ? '' : 'Escribe el curso a reforzar'

  return !studentNameError.value && !courseError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await submitInterest({
      studentName: studentName.value,
      courseToReinforce: courseToReinforce.value,
    })

    status.value = 'success'
    studentName.value = ''
    courseToReinforce.value = ''
  } catch {
    status.value = 'error'
    submitErrorMessage.value = 'No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.'
  }
}
</script>

<style lang="scss">
.quick-interest-form {
  max-width: 26rem;
  margin: 2rem auto 0;
  padding: 1.5rem;
  background-color: $color-accent-yellow-soft;
  transform: rotate(-1deg);
  @include doodle-frame;

  @include respond-to(tablet) {
    margin-top: 3rem;
  }

  &__heading {
    margin: 0 0 1rem;
    font-family: $font-doodle;
    font-size: 1.5rem;
    color: $color-text-dark;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    padding: 0.5rem 0;
    background: transparent;
    border: none;
    border-bottom: 2px dashed $color-text-dark;
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;

    &:focus-visible {
      outline: none;
      border-bottom-color: $color-primary;
    }
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__submit {
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-background;
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
  }

  &__message--success {
    color: $color-primary;
  }

  &__message--error {
    color: $color-error;
  }
}
</style>
