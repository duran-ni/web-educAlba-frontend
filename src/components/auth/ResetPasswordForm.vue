<template>
  <form
    v-if="status !== 'success' && status !== 'invalid-link'"
    class="reset-password-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div class="reset-password-form__tape" aria-hidden="true"></div>
    <div class="reset-password-form__clip" aria-hidden="true">
      <svg viewBox="0 0 24 40">
        <path d="M12 2 V30 C12 34 16 34 16 30 V8 C16 6 20 6 20 8 V32 C20 38 4 38 4 32 V4" />
      </svg>
    </div>

    <div class="reset-password-form__heading">
      <h1 class="reset-password-form__title">Crea una nueva contraseña</h1>
      <p class="reset-password-form__subtitle">Elige una contraseña nueva para tu cuenta</p>
      <span class="reset-password-form__subtitle-underline" aria-hidden="true"></span>
    </div>

    <div class="reset-password-form__field">
      <label class="reset-password-form__label" for="reset-password-password">Nueva contraseña</label>
      <input
        id="reset-password-password"
        v-model="password"
        class="reset-password-form__input"
        type="password"
        placeholder="••••••••"
        :aria-invalid="Boolean(passwordError)"
        :aria-describedby="passwordError ? 'reset-password-password-error' : undefined"
      />
      <p v-if="passwordError" id="reset-password-password-error" class="reset-password-form__field-error">
        {{ passwordError }}
      </p>
    </div>

    <div class="reset-password-form__field">
      <label class="reset-password-form__label" for="reset-password-confirm-password"
        >Confirmar contraseña</label
      >
      <input
        id="reset-password-confirm-password"
        v-model="confirmPassword"
        class="reset-password-form__input"
        type="password"
        placeholder="••••••••"
        :aria-invalid="Boolean(confirmPasswordError)"
        :aria-describedby="confirmPasswordError ? 'reset-password-confirm-password-error' : undefined"
      />
      <p
        v-if="confirmPasswordError"
        id="reset-password-confirm-password-error"
        class="reset-password-form__field-error"
      >
        {{ confirmPasswordError }}
      </p>
    </div>

    <button class="reset-password-form__submit" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Guardando…' : 'Guardar nueva contraseña' }}
    </button>

    <p
      v-if="status === 'error'"
      class="reset-password-form__message reset-password-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>
  </form>

  <div v-else-if="status === 'invalid-link'" class="reset-password-form reset-password-form--info">
    <div class="reset-password-form__tape" aria-hidden="true"></div>

    <div class="reset-password-form__heading">
      <h1 class="reset-password-form__title">Enlace no válido</h1>
      <p class="reset-password-form__subtitle">{{ submitErrorMessage }}</p>
      <span class="reset-password-form__subtitle-underline" aria-hidden="true"></span>
    </div>

    <p class="reset-password-form__login-link">
      <RouterLink :to="{ name: 'forgot-password' }">Solicitar un nuevo enlace</RouterLink>
    </p>
  </div>

  <div v-else class="reset-password-form reset-password-form--info">
    <div class="reset-password-form__tape" aria-hidden="true"></div>

    <div class="reset-password-form__heading">
      <h1 class="reset-password-form__title">¡Contraseña actualizada!</h1>
      <p class="reset-password-form__subtitle">Ya puedes acceder a tu cuenta con tu nueva contraseña</p>
      <span class="reset-password-form__subtitle-underline" aria-hidden="true"></span>
    </div>

    <p class="reset-password-form__login-link">
      <RouterLink :to="{ name: 'login' }">Ir a Acceder</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { resetPassword } from '@/services/auth'

const route = useRoute()

// El token llega como parametro de consulta en el enlace del correo
// (ver PasswordResetService.sendResetEmail, en el backend)
const token = route.query.token

const password = ref('')
const confirmPassword = ref('')

const passwordError = ref('')
const confirmPasswordError = ref('')

// idle (formulario normal) | submitting (formulario normal) | success (contraseña cambiada) | error (fallo de red/servidor, puede reintentarse) | invalid-link (el token no existe, ya se usó, o ha caducado)
const status = ref(token ? 'idle' : 'invalid-link')
const submitErrorMessage = ref(
  token ? '' : 'Este enlace no incluye un token de restablecimiento válido.',
)

// Misma longitud minima que valida el backend (ver PasswordResetService),
// para dar feedback inmediato sin esperar a la peticion
const MIN_PASSWORD_LENGTH = 8

function validate() {
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

  return !passwordError.value && !confirmPasswordError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await resetPassword({ token, password: password.value })
    status.value = 'success'
  } catch (error) {
    // El backend devuelve 400 tanto si el token no existe/ha caducado como
    // si la contraseña es demasiado corta; en ambos casos trae ya un
    // mensaje en español listo para mostrar (ver GlobalExceptionHandler)
    if (error.response?.status === 400) {
      status.value = 'invalid-link'
      submitErrorMessage.value =
        error.response.data?.message ?? 'El enlace de restablecimiento no es válido.'
    } else {
      status.value = 'error'
      submitErrorMessage.value =
        'No hemos podido actualizar tu contraseña. Inténtalo de nuevo en unos minutos.'
    }
  }
}
</script>

<style lang="scss">
.reset-password-form {
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

  &--info {
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
