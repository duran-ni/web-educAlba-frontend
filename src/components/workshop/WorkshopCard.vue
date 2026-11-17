<template>
  <article class="workshop-card">
    <h3 class="workshop-card__name">{{ workshop.name }}</h3>
    <p class="workshop-card__description">{{ workshop.description }}</p>

    <div class="workshop-card__details">
      <div class="workshop-card__detail-row">
        <svg class="workshop-card__icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M3 9h18M8 3v4M16 3v4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span>{{ formattedDate }} / {{ formattedTime }}</span>
      </div>

      <div v-if="workshop.recommendedAge" class="workshop-card__detail-row">
        <svg class="workshop-card__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="9" cy="10" r="1.2" fill="currentColor" />
          <circle cx="15" cy="10" r="1.2" fill="currentColor" />
          <path
            d="M8 14.5 Q12 18.5 16 14.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span>{{ workshop.recommendedAge }}</span>
      </div>

      <div class="workshop-card__detail-row">
        <svg class="workshop-card__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
          <text
            x="12"
            y="16"
            text-anchor="middle"
            font-size="11"
            font-weight="700"
            fill="currentColor"
            stroke="none"
          >€</text>
        </svg>
        <span>{{ formattedPrice }}</span>
      </div>
    </div>

    <div v-if="canEnroll" class="workshop-card__enroll">
      <p v-if="isEnrolled" class="workshop-card__enrolled-badge">
        Ya estás apuntado/a
      </p>

      <template v-else>
        <button
          type="button"
          class="workshop-card__enroll-button"
          :disabled="enrollStatus === 'submitting'"
          @click="handleEnroll"
        >
          {{ enrollStatus === 'submitting' ? 'Apuntando…' : 'Apuntarme' }}
        </button>

        <p
          v-if="enrollStatus === 'error'"
          class="workshop-card__enroll-error"
          role="alert"
        >
          {{ enrollErrorMessage }}
        </p>
      </template>
    </div>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'
import { formatWorkshopTime } from '@/utils/formatWorkshopTime'
import { formatWorkshopPrice } from '@/utils/formatWorkshopPrice'
import { enrollInWorkshop } from '@/services/dashboard'

const props = defineProps({
  // Datos del taller a mostrar (tal como los devuelve el backend)
  workshop: {
    type: Object,
    required: true,
  },
  // Solo true si el usuario ha iniciado sesion con el rol de familia/alumno:
  // controla si se muestra el boton "Apuntarme" en esta tarjeta
  canEnroll: {
    type: Boolean,
    default: false,
  },
  // Ids de los talleres en los que el alumno del usuario ya esta inscrito
  enrolledWorkshopIds: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['enrolled'])

const formattedDate = computed(() => formatWorkshopDate(props.workshop.date))
const formattedTime = computed(() => formatWorkshopTime(props.workshop.time))
const formattedPrice = computed(() => formatWorkshopPrice(props.workshop.price))

const isEnrolled = computed(() => props.enrolledWorkshopIds.includes(props.workshop.id))

// idle | submitting | error
const enrollStatus = ref('idle')
const enrollErrorMessage = ref('')

async function handleEnroll() {
  enrollStatus.value = 'submitting'

  try {
    await enrollInWorkshop(props.workshop.id)
    enrollStatus.value = 'idle'
    emit('enrolled', props.workshop.id)
  } catch (error) {
    enrollStatus.value = 'error'
    enrollErrorMessage.value =
      error.response?.status === 409
        ? 'Ya estabas apuntado/a a este taller.'
        : 'No se ha podido completar la inscripción. Inténtalo de nuevo.'
  }
}
</script>

<style lang="scss">
.workshop-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 3rem;
  background-color: $color-background-highlight;
  @include doodle-frame;

  @include respond-to(tablet) {
  width: 100%;
  max-width: 35rem;
  margin-inline: auto;
}

  &:nth-child(odd) {
    transform: rotate(1deg);
  }

  &:nth-child(even) {
    transform: rotate(-1deg);
  }

  &:nth-child(4n + 1) {
    background-color: $color-accent-yellow-soft;
  }

  &:nth-child(4n + 2) {
    background-color: $color-accent-pink;
  }

  &:nth-child(4n + 3) {
    background-color: $color-accent-green-soft;
  }

  &:nth-child(4n + 4) {
    background-color: $color-background-soft;
  }

  &__name {
    margin: 0;
    font-family: $font-heading;
    font-weight: 600;
    font-size: 1.25rem;
    color: $color-primary;
  }

  &__description {
    margin: 0;
    color: $color-text-dark;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 2px dashed $color-text-dark;
  }

  &__detail-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &__enroll {
    margin-top: 0.75rem;
  }

  &__enroll-button {
    width: 100%;
    padding: 0.625rem 1.5rem;
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

  &__enrolled-badge {
    margin: 0;
    padding: 0.625rem 1.5rem;
    text-align: center;
    border-radius: 999px;
    background-color: $color-accent-green-soft;
    color: $color-text-dark;
    font-family: $font-heading;
    font-weight: 600;
  }

  &__enroll-error {
    margin: 0.5rem 0 0;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $color-error;
    text-align: center;
  }
}
</style>
