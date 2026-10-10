<template>
  <form class="workshop-form" novalidate @submit.prevent="handleSubmit">
    <div class="workshop-form__heading">
      <h2 class="workshop-form__title">{{ isEditing ? 'Editar taller' : 'Nuevo taller' }}</h2>
    </div>

    <div class="workshop-form__field">
      <label class="workshop-form__label" for="workshop-name">Nombre del taller</label>
      <input
        id="workshop-name"
        v-model.trim="name"
        class="workshop-form__input"
        type="text"
        placeholder="Ej. Robótica para peques"
        :aria-invalid="Boolean(nameError)"
        :aria-describedby="nameError ? 'workshop-name-error' : undefined"
      />
      <p v-if="nameError" id="workshop-name-error" class="workshop-form__field-error">
        {{ nameError }}
      </p>
    </div>

    <div class="workshop-form__field">
      <label class="workshop-form__label" for="workshop-description">Descripción</label>
      <textarea
        id="workshop-description"
        v-model.trim="description"
        class="workshop-form__input workshop-form__input--textarea"
        rows="3"
        placeholder="De qué trata el taller"
      ></textarea>
    </div>

    <div class="workshop-form__row">
      <div class="workshop-form__field">
        <label class="workshop-form__label" for="workshop-date">Fecha</label>
        <input
          id="workshop-date"
          v-model="date"
          class="workshop-form__input"
          type="date"
          :aria-invalid="Boolean(dateError)"
          :aria-describedby="dateError ? 'workshop-date-error' : undefined"
        />
        <p v-if="dateError" id="workshop-date-error" class="workshop-form__field-error">
          {{ dateError }}
        </p>
      </div>

      <div class="workshop-form__field">
        <label class="workshop-form__label" for="workshop-time">Hora</label>
        <input
          id="workshop-time"
          v-model="time"
          class="workshop-form__input"
          type="time"
          :aria-invalid="Boolean(timeError)"
          :aria-describedby="timeError ? 'workshop-time-error' : undefined"
        />
        <p v-if="timeError" id="workshop-time-error" class="workshop-form__field-error">
          {{ timeError }}
        </p>
      </div>
    </div>

    <div class="workshop-form__row">
      <div class="workshop-form__field">
        <label class="workshop-form__label" for="workshop-age">Edad recomendada</label>
        <input
          id="workshop-age"
          v-model.trim="recommendedAge"
          class="workshop-form__input"
          type="text"
          placeholder="Ej. 6-10"
        />
      </div>

      <div class="workshop-form__field">
        <label class="workshop-form__label" for="workshop-room">Sala</label>
        <input
          id="workshop-room"
          v-model.trim="room"
          class="workshop-form__input"
          type="text"
          placeholder="Ej. Sala A"
        />
      </div>
    </div>

    <label class="workshop-form__active">
      <input v-model="active" type="checkbox" class="workshop-form__active-input" />
      Taller activo (visible en la web pública)
    </label>

    <div class="workshop-form__actions">
      <button
        type="button"
        class="workshop-form__cancel"
        :disabled="status === 'submitting'"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
      <button class="workshop-form__submit" type="submit" :disabled="status === 'submitting'">
        {{ submitButtonLabel }}
      </button>
    </div>

    <p
      v-if="status === 'error'"
      class="workshop-form__message workshop-form__message--error"
      role="alert"
    >
      {{ submitErrorMessage }}
    </p>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createWorkshop, updateWorkshop } from '@/services/workshops'

// Si se recibe un taller por prop, el formulario entra en modo edición:
// precarga sus datos y, al guardar, actualiza en vez de crear. El
// componente padre es responsable de volver a crear este formulario
// (con :key) cada vez que cambia el taller a editar, para que los
// campos se recarguen limpios
const props = defineProps({
  workshop: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['created', 'updated', 'cancel'])

const isEditing = computed(() => props.workshop !== null)

const name = ref(props.workshop?.name ?? '')
const description = ref(props.workshop?.description ?? '')
const date = ref(props.workshop?.date ?? '')
const time = ref(props.workshop?.time ?? '')
const recommendedAge = ref(props.workshop?.recommendedAge ?? '')
const room = ref(props.workshop?.room ?? '')
const active = ref(props.workshop?.active ?? true)

const nameError = ref('')
const dateError = ref('')
const timeError = ref('')

const status = ref('idle')
const submitErrorMessage = ref('')

const submitButtonLabel = computed(() => {
  if (status.value === 'submitting') {
    return 'Guardando…'
  }

  return isEditing.value ? 'Guardar cambios' : 'Guardar taller'
})

function validate() {
  nameError.value = name.value ? '' : 'Escribe el nombre del taller'
  dateError.value = date.value ? '' : 'Selecciona una fecha'
  timeError.value = time.value ? '' : 'Selecciona una hora'

  return !nameError.value && !dateError.value && !timeError.value
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  status.value = 'submitting'

  const payload = {
    name: name.value,
    description: description.value,
    date: date.value,
    time: time.value,
    recommendedAge: recommendedAge.value,
    room: room.value,
    active: active.value,
  }

  try {
    if (isEditing.value) {
      const response = await updateWorkshop(props.workshop.id, payload)
      status.value = 'idle'
      emit('updated', response.data)
    } else {
      const response = await createWorkshop(payload)
      status.value = 'idle'
      emit('created', response.data)
    }
  } catch {
    status.value = 'error'
    submitErrorMessage.value = isEditing.value
      ? 'No hemos podido guardar los cambios. Inténtalo de nuevo en unos minutos.'
      : 'No hemos podido guardar el taller. Inténtalo de nuevo en unos minutos.'
  }
}
</script>

<style lang="scss">
.workshop-form {
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
  }

  &__input--textarea {
    resize: vertical;
  }

  &__field-error {
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
  }

  &__active {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-body;
    font-size: 0.9375rem;
    color: $color-text-dark;
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
