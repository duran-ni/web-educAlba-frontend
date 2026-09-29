<template>
  <form class="contact-form" novalidate @submit.prevent="handleSubmit">
    <div class="contact-form__tape" aria-hidden="true"></div>

    <template v-if="status !== 'success'">
      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-name">Tu Nombre</label>
        <input
          id="contact-name"
          v-model.trim="name"
          class="contact-form__input"
          type="text"
          placeholder="Ej. Profe María"
          :aria-invalid="Boolean(nameError)"
          :aria-describedby="nameError ? 'contact-name-error' : undefined"
        />
        <p v-if="nameError" id="contact-name-error" class="contact-form__field-error">{{ nameError }}</p>
      </div>

      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-email">Tu Email</label>
        <input
          id="contact-email"
          v-model.trim="email"
          class="contact-form__input"
          type="email"
          placeholder="hola@ejemplo.com"
          :aria-invalid="Boolean(emailError)"
          :aria-describedby="emailError ? 'contact-email-error' : undefined"
        />
        <p v-if="emailError" id="contact-email-error" class="contact-form__field-error">{{ emailError }}</p>
      </div>

      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-subject">Asunto</label>
        <input
          id="contact-subject"
          v-model.trim="subject"
          class="contact-form__input"
          type="text"
          placeholder="Información sobre talleres"
          :aria-invalid="Boolean(subjectError)"
          :aria-describedby="subjectError ? 'contact-subject-error' : undefined"
        />
        <p v-if="subjectError" id="contact-subject-error" class="contact-form__field-error">{{ subjectError }}</p>
      </div>

      <div class="contact-form__field">
        <label class="contact-form__label" for="contact-message">Mensaje</label>
        <textarea
          id="contact-message"
          v-model.trim="message"
          class="contact-form__input contact-form__input--textarea"
          rows="4"
          placeholder="Escribe aquí tu mensaje..."
          :aria-invalid="Boolean(messageError)"
          :aria-describedby="messageError ? 'contact-message-error' : undefined"
        ></textarea>
        <p v-if="messageError" id="contact-message-error" class="contact-form__field-error">{{ messageError }}</p>
      </div>

      <button class="contact-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ status === 'submitting' ? 'Enviando…' : 'Enviar Avión de Papel' }}
      </button>

      <p
        v-if="status === 'error'"
        class="contact-form__message contact-form__message--error"
        role="alert"
      >
        {{ submitErrorMessage }}
      </p>
    </template>

    <p v-else class="contact-form__message contact-form__message--success" role="status" aria-live="polite">
      ¡Gracias por escribirnos! Te responderemos lo antes posible.
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { submitContactMessage } from '@/services/contact'

const props = defineProps({
  initialSubject: {
    type: String,
    default: '',
  },
})

const name = ref('')
const email = ref('')
const subject = ref(props.initialSubject)
const message = ref('')

const nameError = ref('')
const emailError = ref('')
const subjectError = ref('')
const messageError = ref('')

const status = ref('idle')
const submitErrorMessage = ref('')

// Mismo patron de validacion basico usado en el resto de formularios del proyecto
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  nameError.value = name.value ? '' : 'Escribe tu nombre'

  emailError.value = ''
  if (!email.value) {
    emailError.value = 'Escribe tu email'
  } else if (!EMAIL_PATTERN.test(email.value)) {
    emailError.value = 'Escribe un email válido'
  }

  subjectError.value = subject.value ? '' : 'Escribe un asunto'
  messageError.value = message.value ? '' : 'Escribe tu mensaje'

  return !nameError.value && !emailError.value && !subjectError.value && !messageError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  try {
    await submitContactMessage({
      name: name.value,
      email: email.value,
      subject: subject.value,
      message: message.value,
    })

    status.value = 'success'
  } catch {
    status.value = 'error'
    submitErrorMessage.value = 'No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.'
  }
}
</script>

<style lang="scss">
.contact-form {
  position: relative;
  max-width: 32rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: $color-accent-yellow-soft;
  transform: rotate(1deg);
  @include doodle-frame;

  &__tape {
    position: absolute;
    top: -0.75rem;
    left: 50%;
    width: 5rem;
    height: 1.5rem;
    background-color: rgba($color-background, 0.7);
    border: 2px solid $color-text-dark;
    transform: translateX(-50%) rotate(-2deg);
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

  &__input--textarea {
    resize: none;
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__submit {
    align-self: flex-start;
    margin-top: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-accent-pink;
    color: $color-text-dark;
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
