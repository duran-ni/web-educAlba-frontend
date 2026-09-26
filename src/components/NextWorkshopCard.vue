<template>
  <section class="next-workshop-card">
    <div class="next-workshop-card__content">
      <h2 class="next-workshop-card__heading">¡Próximo Taller!</h2>

      <p v-if="status === 'loading'" class="next-workshop-card__message">
        Cargando el próximo taller…
      </p>

      <div v-else-if="status === 'has-workshop'" class="next-workshop-card__details">
        <p class="next-workshop-card__name">{{ workshop.name }}</p>
        <p class="next-workshop-card__description">{{ workshop.description }}</p>
      </div>

      <p v-else-if="status === 'empty'" class="next-workshop-card__message">
        No hay talleres programados por el momento.
      </p>

      <p v-else class="next-workshop-card__message">
        No hemos podido cargar el próximo taller. Inténtalo de nuevo más tarde.
      </p>
    </div>

    <div v-if="status === 'has-workshop'" class="next-workshop-card__date-row">
      <svg class="next-workshop-card__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
        <path
          d="M3 9h18M8 3v4M16 3v4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span class="next-workshop-card__date">{{ formattedDate }} / {{ formattedTime }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchNextWorkshop } from '@/services/workshops'
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'
import { formatWorkshopTime } from '@/utils/formatWorkshopTime'

const status = ref('loading')
const workshop = ref(null)

const formattedDate = computed(() => (workshop.value ? formatWorkshopDate(workshop.value.date) : ''))
const formattedTime = computed(() => (workshop.value ? formatWorkshopTime(workshop.value.time) : ''))

onMounted(async () => {
  try {
    const response = await fetchNextWorkshop()

    if (response.status === 204 || !response.data) {
      status.value = 'empty'
      return
    }

    workshop.value = response.data
    status.value = 'has-workshop'
  } catch {
    status.value = 'error'
  }
})
</script>

<style lang="scss">
.next-workshop-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: $color-background-soft;
  transform: rotate(-1deg);
  @include doodle-frame;

  &__heading {
    margin: 0 0 1rem;
    font-family: $font-doodle;
    font-size: 1.5rem;
    color: $color-text-dark;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__name {
    margin: 0;
    font-family: $font-heading;
    font-weight: 600;
    font-size: 1.125rem;
    color: $color-primary;
  }

  &__description {
    margin: 0;
    color: $color-text-dark;
  }

  &__message {
    margin: 0;
    color: $color-text-dark;
  }

  &__date-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 2px dashed $color-text-dark;
    color: $color-primary;
  }

  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  &__date {
    font-family: $font-heading;
    font-weight: 600;
    text-transform: capitalize;
  }
}
</style>
