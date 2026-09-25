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
        <span>{{ formattedDate }}</span>
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
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'

const props = defineProps({
  // Datos del taller a mostrar (tal como los devuelve el backend)
  workshop: {
    type: Object,
    required: true,
  },
})

const formattedDate = computed(() => formatWorkshopDate(props.workshop.date))
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
    max-width: 35rem;
    justify-self: center;
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
    margin-top: 0.5rem;
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
}
</style>
