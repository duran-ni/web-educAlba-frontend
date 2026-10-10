<template>
  <article class="my-workshop-card">
    <h3 class="my-workshop-card__name">{{ enrollment.workshopName }}</h3>

    <div class="my-workshop-card__detail-row">
      <svg class="my-workshop-card__icon" viewBox="0 0 24 24" aria-hidden="true">
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

    <p class="my-workshop-card__progress">{{ enrollment.progress }}</p>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'
import { formatWorkshopTime } from '@/utils/formatWorkshopTime'

const props = defineProps({
  // Datos de una inscripcion, tal como los devuelve /api/dashboard/my-workshops
  // (MyWorkshopResponse en el backend): enrollmentId, workshopId, workshopName,
  // date, time, progress
  enrollment: {
    type: Object,
    required: true,
  },
})

const formattedDate = computed(() => formatWorkshopDate(props.enrollment.date))
const formattedTime = computed(() => formatWorkshopTime(props.enrollment.time))
</script>

<style lang="scss">
.my-workshop-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 2rem;
  background-color: $color-background-highlight;
  @include doodle-frame;

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

  &__progress {
    margin: 0;
    align-self: flex-start;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-text-dark;
    font-family: $font-body;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: capitalize;
  }
}
</style>
