<template>
  <form class="register-form" novalidate @submit.prevent="handleSubmit">
    <div class="register-form__tape" aria-hidden="true"></div>
    <div class="register-form__clip" aria-hidden="true">
      <svg viewBox="0 0 24 40">
        <path d="M12 2 V30 C12 34 16 34 16 30 V8 C16 6 20 6 20 8 V32 C20 38 4 38 4 32 V4" />
      </svg>
    </div>

    <div class="register-form__heading">
      <h1 class="register-form__title">¡Únete a la familia!</h1>
      <p class="register-form__subtitle">
        Crea tu cuenta de alumno/a en <span class="register-form__brand">EducAlba</span>
      </p>
      <span class="register-form__subtitle-underline" aria-hidden="true"></span>
    </div>

    <div class="register-form__row">
      <div class="register-form__field">
        <label class="register-form__label" for="register-first-name">Nombre del alumno/a</label>
        <input
          id="register-first-name"
          v-model.trim="firstName"
          class="register-form__input"
          type="text"
          placeholder="Ej. Lucía"
          :aria-invalid="Boolean(firstNameError)"
          :aria-describedby="firstNameError ? 'register-first-name-error' : undefined"
        />
        <p v-if="firstNameError" id="register-first-name-error" class="register-form__field-error">
          {{ firstNameError }}
        </p>
      </div>

      <div class="register-form__field">
        <label class="register-form__label" for="register-last-name">Apellidos</label>
        <input
          id="register-last-name"
          v-model.trim="lastName"
          class="register-form__input"
          type="text"
          placeholder="García López"
          :aria-invalid="Boolean(lastNameError)"
          :aria-describedby="lastNameError ? 'register-last-name-error' : undefined"
        />
        <p v-if="lastNameError" id="register-last-name-error" class="register-form__field-error">
          {{ lastNameError }}
        </p>
      </div>
    </div>

    <div class="register-form__field">
      <label class="register-form__label" for="register-email">Correo electrónico</label>
      <input
        id="register-email"
        v-model.trim="email"
        class="register-form__input"
        type="email"
        placeholder="familia@ejemplo.com"
        :aria-invalid="Boolean(emailError)"
        :aria-describedby="emailError ? 'register-email-error' : undefined"
      />
      <p v-if="emailError" id="register-email-error" class="register-form__field-error">
        {{ emailError }}
      </p>
    </div>

    <div class="register-form__row">
      <div class="register-form__field">
        <label class="register-form__label" for="register-stage">Etapa educativa</label>
        <select
          id="register-stage"
          v-model="educationalStage"
          class="register-form__input register-form__input--select"
          :aria-invalid="Boolean(educationalStageError)"
          :aria-describedby="educationalStageError ? 'register-stage-error' : undefined"
        >
          <option value="" disabled>Selecciona una etapa</option>
          <option v-for="stage in EDUCATIONAL_STAGES" :key="stage.value" :value="stage.value">
            {{ stage.label }}
          </option>
        </select>
        <p
          v-if="educationalStageError"
          id="register-stage-error"
          class="register-form__field-error"
        >
          {{ educationalStageError }}
        </p>
      </div>

      <div class="register-form__field">
        <label class="register-form__label" for="register-service">Servicio principal</label>
        <select
          id="register-service"
          v-model="serviceOfInterest"
          class="register-form__input register-form__input--select"
          :aria-invalid="Boolean(serviceOfInterestError)"
          :aria-describedby="serviceOfInterestError ? 'register-service-error' : undefined"
        >
          <option value="" disabled>Selecciona un servicio</option>
          <option v-for="service in SERVICES" :key="service" :value="service">{{ service }}</option>
        </select>
        <p
          v-if="serviceOfInterestError"
          id="register-service-error"
          class="register-form__field-error"
        >
          {{ serviceOfInterestError }}
        </p>
      </div>
    </div>

    <div class="register-form__row">
      <div class="register-form__field">
        <label class="register-form__label" for="register-password">Crear contraseña</label>
        <input
          id="register-password"
          v-model="password"
          class="register-form__input"
          type="password"
          placeholder="••••••••"
          :aria-invalid="Boolean(passwordError)"
          :aria-describedby="passwordError ? 'register-password-error' : undefined"
        />
        <p v-if="passwordError" id="register-password-error" class="register-form__field-error">
          {{ passwordError }}
        </p>
      </div>

      <div class="register-form__field">
        <label class="register-form__label" for="register-confirm-password"
          >Confirmar contraseña</label
        >
        <input
          id="register-confirm-password"
          v-model="confirmPassword"
          class="register-form__input"
          type="password"
          placeholder="••••••••"
          :aria-invalid="Boolean(confirmPasswordError)"
          :aria-describedby="confirmPasswordError ? 'register-confirm-password-error' : undefined"
        />
        <p
          v-if="confirmPasswordError"
          id="register-confirm-password-error"
          class="register-form__field-error"
        >
          {{ confirmPasswordError }}
        </p>
      </div>
    </div>

    <button class="register-form__submit" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Creando cuenta…' : 'Crear mi libreta en EducAlba 🚀' }}
    </button>

    <p
      v-if="status === 'error'"
      class="register-form__message register-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>

    <p class="register-form__login-link">
      ¿Ya tienes libreta de alumno?
      <RouterLink :to="{ name: 'login' }">Entrar a mi cuenta</RouterLink>
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { register } from '@/services/auth'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const educationalStage = ref('')
const serviceOfInterest = ref('')
const password = ref('')
const confirmPassword = ref('')

const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const educationalStageError = ref('')
const serviceOfInterestError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const status = ref('idle')
const submitErrorMessage = ref('')

// Mismo patron de validacion de email usado en el resto de formularios del proyecto
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Misma longitud minima que valida el backend (ver RegisterService) — se
// comprueba tambien aqui para dar feedback inmediato sin esperar a la peticion
const MIN_PASSWORD_LENGTH = 8

// Mismas etapas que contempla el backend (enum EducationalStage) y que ya
// se usan en la pagina de Refuerzo
const EDUCATIONAL_STAGES = [
  { value: 'INFANTIL', label: 'Infantil (3 a 6 años)' },
  { value: 'PRIMARIA', label: 'Primaria (1º a 6º)' },
  { value: 'ESO', label: 'E.S.O. (1º a 4º)' },
]

// Las dos ofertas reales de la academia; de momento texto libre para el backend
const SERVICES = ['Clases de Refuerzo', 'Talleres']

function validate() {
  firstNameError.value = firstName.value ? '' : 'Escribe el nombre del alumno/a'
  lastNameError.value = lastName.value ? '' : 'Escribe los apellidos'

  emailError.value = ''
  if (!email.value) {
    emailError.value = 'Escribe un email'
  } else if (!EMAIL_PATTERN.test(email.value)) {
    emailError.value = 'Escribe un email válido'
  }

  educationalStageError.value = educationalStage.value ? '' : 'Selecciona una etapa educativa'
  serviceOfInterestError.value = serviceOfInterest.value ? '' : 'Selecciona un servicio'

  passwordError.value = ''
  if (!password.value) {
    passwordError.value = 'Escribe una contraseña'
  } else if (password.value.length < MIN_PASSWORD_LENGTH) {
    passwordError.value = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  }

  confirmPasswordError.value = ''
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Confirma tu contraseña'
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Las contraseñas no coinciden'
  }

  return (
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    !educationalStageError.value &&
    !serviceOfInterestError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      serviceOfInterest: serviceOfInterest.value,
      educationalStage: educationalStage.value,
    })

    // Tras crear la cuenta, iniciamos sesion automaticamente con las mismas
    // credenciales para llevar directamente al Dashboard Usuario,
    // sin pedirle a la familia que vuelva a escribir sus datos en Login
    await authStore.login({ email: email.value, password: password.value })
    status.value = 'idle'
    router.push({ name: 'dashboard' })
  } catch (error) {
    status.value = 'error'

    if (error.response?.status === 409) {
      submitErrorMessage.value = 'Ya existe una cuenta registrada con ese email.'
    } else {
      submitErrorMessage.value =
        'No hemos podido crear tu cuenta. Inténtalo de nuevo en unos minutos.'
    }
  }
}
</script>

<style lang="scss">
.register-form {
  position: relative;
  max-width: 45rem;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: $color-background-highlight;
  transform: rotate(-1deg);
  transition: transform 0.2s ease;
  @include doodle-frame;

  &:hover {
    transform: rotate(0deg);
  }

  &__tape {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%) rotate(-1deg);
    width: 5rem;
    height: 1.5rem;
    background-color: rgba($color-accent-yellow, 0.5);
    border: 1px dashed $color-text-dark;
    pointer-events: none;
  }

  &__clip {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%) scaleY(-1);
    width: 1.5rem;
    height: 2.5rem;
    pointer-events: none;

    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: $color-text-dark;
      stroke-width: 2;
      stroke-linecap: round;
    }
  }

  &__heading {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  &__title {
    margin: 0 0 0.25rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;
  }

  &__subtitle {
    margin-top: 1.5rem;
    font-family: $font-body;
    font-size: 1.125rem;
    color: $color-text-dark;
  }

  &__brand {
    font-family: $font-doodle;
    font-size: 1.25rem;
     font-weight: 700;
    color: $color-primary;
  }

  &__subtitle-underline {
    display: block;
    width: 5.5rem;
    height: 4px;
    margin: 0 auto 1rem;
    transform: translateX(0.75rem);
    background-color: $color-accent-yellow;
    border-radius: 999px;
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
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.875rem 1.5rem;
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

  &__login-link {
    margin: 0;
    text-align: center;
    font-family: $font-body;
    font-size: 1rem;
    color: $color-text-dark;

    a {
      font-family: $font-doodle;
      font-size: 1.25rem;
       font-weight: 700;
      color: $color-primary;
    }
  }
}
</style>
