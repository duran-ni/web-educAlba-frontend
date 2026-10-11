<template>
  <form class="student-form" novalidate @submit.prevent="handleSubmit">
    <div class="student-form__heading">
      <h2 class="student-form__title">Nuevo alumno</h2>
    </div>

    <div class="student-form__row">
      <div class="student-form__field">
        <label class="student-form__label" for="student-first-name">Nombre</label>
        <input
          id="student-first-name"
          v-model.trim="firstName"
          class="student-form__input"
          type="text"
          placeholder="Ej. Lucía"
          :aria-invalid="Boolean(firstNameError)"
          :aria-describedby="firstNameError ? 'student-first-name-error' : undefined"
        />
        <p v-if="firstNameError" id="student-first-name-error" class="student-form__field-error">
          {{ firstNameError }}
        </p>
      </div>

      <div class="student-form__field">
        <label class="student-form__label" for="student-last-name">Apellidos</label>
        <input
          id="student-last-name"
          v-model.trim="lastName"
          class="student-form__input"
          type="text"
          placeholder="Ej. García Pérez"
          :aria-invalid="Boolean(lastNameError)"
          :aria-describedby="lastNameError ? 'student-last-name-error' : undefined"
        />
        <p v-if="lastNameError" id="student-last-name-error" class="student-form__field-error">
          {{ lastNameError }}
        </p>
      </div>
    </div>

    <div class="student-form__field">
      <label class="student-form__label" for="student-stage">Etapa educativa</label>
      <select
        id="student-stage"
        v-model="educationalStage"
        class="student-form__input student-form__input--select"
        :aria-invalid="Boolean(educationalStageError)"
        :aria-describedby="educationalStageError ? 'student-stage-error' : undefined"
      >
        <option value="" disabled>Selecciona una etapa</option>
        <option v-for="stage in EDUCATIONAL_STAGES" :key="stage.value" :value="stage.value">
          {{ stage.label }}
        </option>
      </select>
      <p v-if="educationalStageError" id="student-stage-error" class="student-form__field-error">
        {{ educationalStageError }}
      </p>
    </div>

    <label class="student-form__attends-workshop">
      <input v-model="attendsWorkshop" type="checkbox" class="student-form__checkbox" />
      Además, está apuntado a un taller
    </label>

    <div v-if="attendsWorkshop" class="student-form__field">
      <label class="student-form__label" for="student-workshop">Taller</label>

      <select
        id="student-workshop"
        v-model="workshopId"
        class="student-form__input student-form__input--select"
        :disabled="workshopsStatus !== 'loaded'"
        :aria-invalid="Boolean(workshopIdError)"
        :aria-describedby="workshopIdError ? 'student-workshop-error' : undefined"
      >
        <option value="" disabled>Selecciona un taller</option>
        <option v-for="workshop in workshops" :key="workshop.id" :value="workshop.id">
          {{ workshop.name }}
        </option>
      </select>

      <p v-if="workshopsStatus === 'error'" class="student-form__field-error">
        No hemos podido cargar los talleres disponibles.
      </p>
      <p v-if="workshopIdError" id="student-workshop-error" class="student-form__field-error">
        {{ workshopIdError }}
      </p>
    </div>

    <div class="student-form__actions">
      <button
        type="button"
        class="student-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button class="student-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ submitButtonLabel }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="student-form__message student-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createStudent } from '@/services/students'
import { createEnrollment } from '@/services/enrollments'
import { fetchWorkshops } from '@/services/workshops'

const emit = defineEmits(['created', 'cancel'])

// Mismas etapas que contempla el backend (enum EducationalStage), ya usadas
// en RegisterForm.vue
const EDUCATIONAL_STAGES = [
  { value: 'INFANTIL', label: 'Infantil (3 a 6 años)' },
  { value: 'PRIMARIA', label: 'Primaria (1º a 6º)' },
  { value: 'ESO', label: 'E.S.O. (1º a 4º)' },
]

const firstName = ref('')
const lastName = ref('')
const educationalStage = ref('')

// Este panel es solo para altas formales (Refuerzo); por eso el servicio
// ya no se elige, es siempre el mismo. A mayores, se puede marcar que el
// alumno también asiste a un taller concreto
const attendsWorkshop = ref(false)
const workshopId = ref('')

const firstNameError = ref('')
const lastNameError = ref('')
const educationalStageError = ref('')
const workshopIdError = ref('')

const status = ref('idle')
const submitErrorMessage = ref('')

// loading | loaded | error
const workshopsStatus = ref('loading')
const workshops = ref([])

onMounted(async () => {
  try {
    const response = await fetchWorkshops()
    workshops.value = response.data
    workshopsStatus.value = 'loaded'
  } catch {
    workshopsStatus.value = 'error'
  }
})

const submitButtonLabel = computed(() =>
  status.value === 'submitting' ? 'Guardando…' : 'Guardar alumno'
)

function validate() {
  firstNameError.value = firstName.value ? '' : 'Escribe el nombre del alumno/a'
  lastNameError.value = lastName.value ? '' : 'Escribe los apellidos'
  educationalStageError.value = educationalStage.value ? '' : 'Selecciona una etapa educativa'
  workshopIdError.value = attendsWorkshop.value && !workshopId.value ? 'Selecciona un taller' : ''

  return (
    !firstNameError.value &&
    !lastNameError.value &&
    !educationalStageError.value &&
    !workshopIdError.value
  )
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    educationalStage: educationalStage.value,
    serviceOfInterest: 'Clases de Refuerzo',
  }

  try {
    const studentResponse = await createStudent(payload)

    if (attendsWorkshop.value) {
      await enrollInWorkshop(studentResponse.data.id)
    }

    status.value = 'idle'
    emit('created', studentResponse.data)
  } catch {
    status.value = 'error'
    submitErrorMessage.value = 'No hemos podido guardar el alumno. Inténtalo de nuevo en unos minutos.'
  }
}

// El alumno ya se ha guardado correctamente en este punto: si falla solo la
// inscripción al taller, se avisa aparte en vez de tratarlo como un fallo
// del alta completa (el alumno no debe perderse por este segundo paso)
async function enrollInWorkshop(studentId) {
  try {
    await createEnrollment({
      studentId,
      workshopId: Number(workshopId.value),
      enrollmentDate: new Date().toISOString().slice(0, 10),
      progress: '',
    })
  } catch {
    window.alert(
      'El alumno se ha guardado, pero no hemos podido apuntarlo al taller. Puedes apuntarlo después desde el panel de Talleres.'
    )
  }
}
</script>

<style lang="scss">
.student-form {
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

  &__row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @include respond-to(tablet) {
      grid-template-columns: 1fr 1fr;
    }
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__input--select {
    appearance: auto;
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__attends-workshop {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $color-text-dark;
  }

  &__checkbox {
    accent-color: $color-primary;
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
