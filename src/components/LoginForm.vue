<template>
  <form class="login-form" novalidate @submit.prevent="handleSubmit">
    <div class="login-form__clip" aria-hidden="true">
      <svg viewBox="0 0 24 40">
        <path d="M12 2 V30 C12 34 16 34 16 30 V8 C16 6 20 6 20 8 V32 C20 38 4 38 4 32 V4" />
      </svg>
    </div>

    <div class="login-form__heading">
      <h1 class="login-form__title">¡Hola!</h1>
      <p class="login-form__subtitle">Bienvenid@ de vuelta a EducAlba</p>
    </div>

    <div class="login-form__field">
      <label class="login-form__label" for="login-email">
        <svg class="login-form__label-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4.5 20c0.5-4.5 4-7 7.5-7s7 2.5 7.5 7" />
        </svg>
        Usuario o Correo
      </label>
      <input
        id="login-email"
        v-model.trim="email"
        class="login-form__input"
        type="text"
        placeholder="tu@email.com"
        :aria-invalid="Boolean(emailError)"
        :aria-describedby="emailError ? 'login-email-error' : undefined"
      />
      <p v-if="emailError" id="login-email-error" class="login-form__field-error">
        {{ emailError }}
      </p>
    </div>

    <div class="login-form__field">
      <label class="login-form__label" for="login-password">
        <svg class="login-form__label-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="6" cy="12" r="4" />
          <path d="M10 12H21 M17 12V15 M20 12V15" />
        </svg>
        Contraseña
      </label>
      <div class="login-form__input-wrapper">
        <input
          id="login-password"
          v-model="password"
          class="login-form__input"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :aria-invalid="Boolean(passwordError)"
          :aria-describedby="passwordError ? 'login-password-error' : undefined"
        />
        <button
          type="button"
          class="login-form__toggle-password"
          :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
        >
          <span class="material-symbols-outlined" aria-hidden="true">
            {{ showPassword ? 'visibility_off' : 'visibility' }}
          </span>
        </button>
      </div>
      <p v-if="passwordError" id="login-password-error" class="login-form__field-error">
        {{ passwordError }}
      </p>
    </div>

    <div class="login-form__row">
      <label class="login-form__remember">
        <input v-model="rememberMe" type="checkbox" class="login-form__remember-input" />
        Recuérdame
      </label>
      <!-- "Olvide mi contrasena" pertenece a la futura historia US33 (Recuperar contrasena), todavia sin implementar -->
      <span class="login-form__forgot">¿Olvidé mi contraseña?</span>
    </div>

    <button class="login-form__submit" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Entrando…' : 'Entrar a clase' }}
      <svg class="login-form__arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 12h14M13 6l6 6-6 6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <p
      v-if="status === 'error'"
      class="login-form__message login-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>

    <p class="login-form__register-link">
      ¿No tienes cuenta?
      <RouterLink :to="{ name: 'register' }">Regístrate</RouterLink>
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/config/roles'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const emailError = ref('')
const passwordError = ref('')

const status = ref('idle')
const submitErrorMessage = ref('')

function validate() {
  emailError.value = email.value ? '' : 'Escribe tu usuario o email'
  passwordError.value = password.value ? '' : 'Escribe tu contraseña'

  return !emailError.value && !passwordError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await authStore.login({ email: email.value, password: password.value, rememberMe: rememberMe.value })
    status.value = 'idle'
    redirectAfterLogin()
  } catch {
    status.value = 'error'
    submitErrorMessage.value = 'Usuario o contraseña incorrectos.'
  }

  // Tras un login correcto, cada rol aterriza en su propia zona de la aplicacion:
  // el administrador en el panel de gestion, y el resto de usuarios en su dashboard
  function redirectAfterLogin() {
    const roles = authStore.user?.roles ?? []
    router.push(roles.includes(ROLES.ADMIN) ? { name: 'admin' } : { name: 'dashboard' })
  }
}
</script>

<style lang="scss">
.login-form {
  position: relative;
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: $color-accent-green-soft;
  transform: rotate(-2deg);
  transition: transform 0.2s ease;
  @include doodle-frame;

  &:hover {
    transform: rotate(0deg);
  }

  &__clip {
    position: absolute;
    top: -1.75rem;
    left: 50%;
    transform: translateX(-50%);
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
    margin-bottom: 1.5rem;
  }

  &__title {
    margin: 0 0 0.25rem;
    font-family: $font-doodle;
    font-size: 2.5rem;
    color: $color-primary;
  }

  &__subtitle {
    margin-top: 2.5rem;
    font-family: $font-body;
    font-size: 1.25rem;
    color: $color-text-dark;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-heading;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-dark;
  }

  &__label-icon {
    width: 1.125rem;
    height: 1.125rem;
    fill: none;
    stroke: $color-primary;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input {
    flex: 1;
    padding: 0.5rem 2rem 0.5rem 0;
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

  &__toggle-password {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    color: $color-text-dark;
    cursor: pointer;

    .material-symbols-outlined {
      font-size: 1.25rem;
    }

    &:hover,
    &:focus-visible {
      color: $color-primary;
    }
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 0.75rem;
    font-family: $font-body;
    font-size: 0.875rem;
  }

  &__remember {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $color-text-dark;
  }

  &__forgot {
    color: $color-text-dark;
    opacity: 0.6;
    text-decoration: underline wavy;
    text-decoration-color: $color-text-dark;
    cursor: not-allowed;
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
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

  &__arrow {
    width: 1.125rem;
    height: 1.125rem;
  }

  &__message {
    margin: 0;
    font-weight: 600;
    text-align: center;
  }

  &__message--error {
    color: $color-error;
  }

  &__register-link {
    margin: 0;
    text-align: center;
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $color-text-dark;

    a {
      font-family: $font-doodle;
      font-size: 1.125rem;
      font-weight: 700;
      color: $color-primary;
    }
  }
}
</style>
