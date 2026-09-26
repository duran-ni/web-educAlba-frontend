<template>
  <section class="workshop-enrollment-form">
    <h2 class="workshop-enrollment-form__heading">¡Apúntate ya!</h2>

    <form
      v-if="status !== 'success'"
      class="workshop-enrollment-form__form"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <div class="workshop-enrollment-form__field">
        <label class="workshop-enrollment-form__label" for="enrollment-student-name">Nombre del alumno/a</label>
        <input
          id="enrollment-student-name"
          v-model.trim="studentName"
          class="workshop-enrollment-form__input"
          type="text"
          placeholder="Escribe aquí…"
          :aria-invalid="Boolean(studentNameError)"
          :aria-describedby="studentNameError ? 'enrollment-student-name-error' : undefined"
        />
        <p v-if="studentNameError" id="enrollment-student-name-error" class="workshop-enrollment-form__field-error">
          {{ studentNameError }}
        </p>
      </div>

      <div class="workshop-enrollment-form__row">
        <div class="workshop-enrollment-form__field">
          <label class="workshop-enrollment-form__label" for="enrollment-age">Edad</label>
          <input
            id="enrollment-age"
            v-model.trim="age"
            class="workshop-enrollment-form__input"
            type="number"
            min="1"
            placeholder="Años"
            :aria-invalid="Boolean(ageError)"
            :aria-describedby="ageError ? 'enrollment-age-error' : undefined"
          />
          <p v-if="ageError" id="enrollment-age-error" class="workshop-enrollment-form__field-error">
            {{ ageError }}
          </p>
        </div>

        <div class="workshop-enrollment-form__field">
          <label class="workshop-enrollment-form__label" for="enrollment-phone">Teléfono de contacto</label>
          <input
            id="enrollment-phone"
            v-model.trim="phone"
            class="workshop-enrollment-form__input"
            type="tel"
            placeholder="600 000 000"
            :aria-invalid="Boolean(phoneError)"
            :aria-describedby="phoneError ? 'enrollment-phone-error' : undefined"
          />
          <p v-if="phoneError" id="enrollment-phone-error" class="workshop-enrollment-form__field-error">
            {{ phoneError }}
          </p>
        </div>
      </div>

      <fieldset class="workshop-enrollment-form__fieldset">
        <legend class="workshop-enrollment-form__legend">Talleres de interés</legend>

        <p v-if="workshopsStatus === 'loading'" class="workshop-enrollment-form__message">
          Cargando talleres…
        </p>
        <p v-else-if="workshopsStatus === 'empty'" class="workshop-enrollment-form__message">
          No hay talleres disponibles actualmente.
        </p>
        <p v-else-if="workshopsStatus === 'error'" class="workshop-enrollment-form__message">
          No hemos podido cargar los talleres. Inténtalo de nuevo más tarde.
        </p>
        <div v-else class="workshop-enrollment-form__checkbox-group">
          <label
            v-for="workshop in workshops"
            :key="workshop.id"
            class="workshop-enrollment-form__checkbox-label"
          >
            <input
              v-model="selectedWorkshopIds"
              class="workshop-enrollment-form__checkbox"
              type="checkbox"
              :value="workshop.id"
            />
            {{ workshop.name }} — {{ formatWorkshopDate(workshop.date) }}
          </label>
        </div>

        <p v-if="workshopsError" id="enrollment-workshops-error" class="workshop-enrollment-form__field-error">
          {{ workshopsError }}
        </p>
      </fieldset>

      <button class="workshop-enrollment-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Enviando…' : 'Enviar Inscripción' }}
      </button>

      <p
        v-if="status === 'error'"
        class="workshop-enrollment-form__message workshop-enrollment-form__message--error"
        role="alert"
      >
        {{ submitErrorMessage }}
      </p>
    </form>

    <p
      v-else
      class="workshop-enrollment-form__message workshop-enrollment-form__message--success"
      role="status"
      aria-live="polite"
    >
      ¡Gracias! Hemos recibido tu inscripción, te contactaremos pronto.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWorkshops } from '@/services/workshops'
import { submitEnrollment } from '@/services/enrollments'
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'

const studentName = ref('')
const age = ref('')
const phone = ref('')
const selectedWorkshopIds = ref([])

const studentNameError = ref('')
const ageError = ref('')
const phoneError = ref('')
const workshopsError = ref('')

const status = ref('idle')
const submitErrorMessage = ref('')

const workshops = ref([])
const workshopsStatus = ref('loading')

// Formato español de teléfono: 9 dígitos, empezando por 6, 7, 8 o 9
const PHONE_PATTERN = /^[6789][0-9]{8}$/

onMounted(async () => {
  try {
    const response = await fetchWorkshops()
    workshops.value = response.data

    workshopsStatus.value = workshops.value.length > 0 ? 'ready' : 'empty'
  } catch {
    workshopsStatus.value = 'error'
  }
})

// Valida los campos obligatorios en el propio frontend, antes de llamar al backend
function validate() {
  studentNameError.value = studentName.value ? '' : 'Escribe el nombre del alumno/a'

  ageError.value = ''
  if (!age.value) {
    ageError.value = 'Escribe la edad'
  } else if (Number(age.value) <= 0) {
    ageError.value = 'La edad debe ser un número mayor que 0'
  }

  phoneError.value = ''
  if (!phone.value) {
    phoneError.value = 'Escribe un teléfono de contacto'
  } else if (!PHONE_PATTERN.test(phone.value)) {
    phoneError.value = 'El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9'
  }

  workshopsError.value = selectedWorkshopIds.value.length > 0 ? '' : 'Selecciona al menos un taller'

  return !studentNameError.value && !ageError.value && !phoneError.value && !workshopsError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await submitEnrollment({
      studentName: studentName.value,
      age: Number(age.value),
      phone: phone.value,
      workshopIds: selectedWorkshopIds.value,
    })

    status.value = 'success'
  } catch {
    status.value = 'error'
    submitErrorMessage.value = 'No hemos podido registrar tu inscripción. Inténtalo de nuevo en unos minutos.'
  }
}
</script>

<style lang="scss">
.workshop-enrollment-form {
  max-width: 40rem;
  margin: 3rem auto 0;
  padding: 1.5rem;
  background-color: $color-background;
  transform: rotate(-1deg);
  @include doodle-frame;

  &__heading {
    margin: 0 0 1.5rem;
    font-family: $font-doodle;
    font-size: 2rem;
    color: $color-primary;
    text-align: center;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__row {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @include respond-to(tablet) {
      flex-direction: row;
    }
  }

  &__field {
    flex: 1;
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

  &__fieldset {
    padding: 0;
    border: none;
  }

  &__legend {
    padding: 0 0 0.5rem;
    font-family: $font-heading;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-dark;
  }

  &__checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;
    cursor: pointer;
  }

  &__checkbox {
    accent-color: $color-primary;
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
    text-align: center;
  }

  &__message--success {
    color: $color-primary;
  }

  &__message--error {
    color: $color-error;
  }
}
</style>
