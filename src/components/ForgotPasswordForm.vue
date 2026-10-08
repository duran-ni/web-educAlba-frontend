<template>
  <form
    v-if="status !== 'success'"
    class="forgot-password-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div class="forgot-password-form__tape" aria-hidden="true"></div>
    <div class="forgot-password-form__clip" aria-hidden="true">
      <svg viewBox="0 0 24 40">
        <path d="M12 2 V30 C12 34 16 34 16 30 V8 C16 6 20 6 20 8 V32 C20 38 4 38 4 32 V4" />
      </svg>
    </div>

    <div class="forgot-password-form__heading">
      <h1 class="forgot-password-form__title">¿Olvidaste tu contraseña?</h1>
      <p class="forgot-password-form__subtitle">
        Escribe tu email y te enviaremos un enlace para crear una nueva
      </p>
      <span class="forgot-password-form__subtitle-underline" aria-hidden="true"></span>
    </div>

    <div class="forgot-password-form__field">
      <label class="forgot-password-form__label" for="forgot-password-email"
        >Correo electrónico</label
      >
      <input
        id="forgot-password-email"
        v-model.trim="email"
        class="forgot-password-form__input"
        type="email"
        placeholder="tu@email.com"
        :aria-invalid="Boolean(emailError)"
        :aria-describedby="emailError ? 'forgot-password-email-error' : undefined"
      />
      <p v-if="emailError" id="forgot-password-email-error" class="forgot-password-form__field-error">
        {{ emailError }}
      </p>
    </div>

    <button class="forgot-password-form__submit" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Enviando…' : 'Enviar enlace de recuperación' }}
    </button>

    <p
      v-if="status === 'error'"
      class="forgot-password-form__message forgot-password-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>

    <p class="forgot-password-form__login-link">
      ¿Ya te acuerdas?
      <RouterLink :to="{ name: 'login' }">Vuelve a Acceder</RouterLink>
    </p>
  </form>

  <div v-else class="forgot-password-form forgot-password-form--success">
    <div class="forgot-password-form__tape" aria-hidden="true"></div>

    <div class="forgot-password-form__heading">
      <h1 class="forgot-password-form__title">¡Revisa tu correo!</h1>
      <p class="forgot-password-form__subtitle">
        Si <strong>{{ email }}</strong> está registrado en EducAlba, te hemos enviado un email con
        instrucciones para restablecer tu contraseña.
      </p>
      <span class="forgot-password-form__subtitle-underline" aria-hidden="true"></span>
    </div>

    <p class="forgot-password-form__login-link">
      <RouterLink :to="{ name: 'login' }">Volver a Acceder</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { requestPasswordReset } from '@/services/auth'

const email = ref('')
const emailError = ref('')

// idle | submitting | success | error
const status = ref('idle')
const submitErrorMessage = ref('')

// Mismo patron de validacion de email usado en el resto de formularios del proyecto
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  emailError.value = ''

  if (!email.value) {
    emailError.value = 'Escribe tu email'
  } else if (!EMAIL_PATTERN.test(email.value)) {
    emailError.value = 'Escribe un email válido'
  }

  return !emailError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await requestPasswordReset(email.value)

    // El backend responde siempre igual (204 sin contenido) exista o no el
    // email, asi que aqui mostramos siempre el mismo mensaje de exito: el
    // formulario nunca debe revelar si esa cuenta esta registrada o no
    status.value = 'success'
  } catch {
    // Solo llegamos aqui ante un fallo real (red caida, backend no disponible...),
    // nunca porque el email no exista
    status.value = 'error'
    submitErrorMessage.value =
      'No hemos podido procesar la solicitud. Inténtalo de nuevo en unos minutos.'
  }
}
</script>

<style lang="scss">
.forgot-password-form {
  position: relative;
  max-width: 32rem;
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

  &--success {
    text-align: center;
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

  &__subtitle-underline {
    display: block;
    width: 5.5rem;
    height: 4px;
    margin: 0 auto 1rem;
    background-color: $color-accent-yellow;
    border-radius: 999px;
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
