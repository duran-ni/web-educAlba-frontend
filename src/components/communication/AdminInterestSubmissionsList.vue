<template>
  <section class="admin-interest-submissions-list">
    <div class="admin-interest-submissions-list__header">
      <h2 class="admin-interest-submissions-list__title">Solicitudes de interés</h2>
    </div>

    <p v-if="status === 'loading'" class="admin-interest-submissions-list__message">
      Cargando solicitudes…
    </p>

    <p
      v-else-if="status === 'error'"
      class="admin-interest-submissions-list__message admin-interest-submissions-list__message--error"
    >
      No hemos podido cargar las solicitudes. Inténtalo de nuevo más tarde.
    </p>

    <p v-else-if="submissions.length === 0" class="admin-interest-submissions-list__message">
      Todavía no ha llegado ninguna solicitud de interés.
    </p>

    <ul v-else class="admin-interest-submissions-list__items">
      <li
        v-for="submission in submissions"
        :key="submission.id"
        class="admin-interest-submissions-list__item"
        :class="{ 'admin-interest-submissions-list__item--reviewed': submission.reviewed }"
      >
        <div class="admin-interest-submissions-list__item-info">
          <p class="admin-interest-submissions-list__item-name">{{ submission.studentName }}</p>
          <p class="admin-interest-submissions-list__item-course">{{ submission.courseToReinforce }}</p>
          <p class="admin-interest-submissions-list__item-phone">Tel: {{ submission.phone }}</p>
          <p class="admin-interest-submissions-list__item-date">
            {{ formatSubmittedAt(submission.submittedAt) }}
          </p>
        </div>

        <div class="admin-interest-submissions-list__item-actions">
          <template v-if="submission.reviewed">
            <span class="admin-interest-submissions-list__reviewed-badge"> Revisada </span>
            <button
              type="button"
              class="admin-interest-submissions-list__close"
              @click="$emit('close', submission.id)"
            >
              Finalizado
            </button>
          </template>
          <button
            v-else
            type="button"
            class="admin-interest-submissions-list__review"
            @click="$emit('mark-reviewed', submission.id)"
          >
            Marcar como revisada
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
  },
  submissions: {
    type: Array,
    required: true,
  },
})

defineEmits(['mark-reviewed', 'close'])

// Convierte la fecha/hora ISO que manda el backend (LocalDateTime) en texto
// legible en español, con fecha y hora juntas
function formatSubmittedAt(isoDateTime) {
  if (!isoDateTime) {
    return ''
  }

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(isoDateTime))
}
</script>

<style lang="scss">
.admin-interest-submissions-list {
  margin-top: 8rem;

  &__header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2.5rem;
    margin: 0 0 3rem;
  }

  &__title {
    margin: 0;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-green-dark;
    transform: rotate(-8deg);
    display: inline-block;
  }

  &__message {
    color: $color-text-dark;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }

  &__items {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0;

    @include respond-to(desktop) {
      grid-template-columns: repeat(auto-fit, minmax(30rem, 35rem));
      gap: 3.5rem;
      margin-left: 10rem;
      margin-right: 4rem;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1.75rem 2.25rem;
    background-color: $color-accent-yellow-soft;
    @include doodle-frame;
  }

  &__item--reviewed {
    opacity: 0.6;
  }

  &__item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__item-name {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__item-course {
    margin: 0;
    font-size: 0.95rem;
    font-family: cursive;
    color: $color-text-dark;
  }

  &__item-phone {
    margin: 0;
    font-size: 0.875rem;
    color: $color-text-dark;
  }

  &__item-date {
    margin: 0;
    font-size: 0.8125rem;
    color: $color-text-dark;
  }

  &__item-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__reviewed-badge {
    flex-shrink: 0;
    padding: 0.4rem 1rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: transparent;
    color: $color-text-dark;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__review {
    flex-shrink: 0;
    padding: 0.4rem 1rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-primary;
      color: $color-background;
    }
  }

  &__close {
    flex-shrink: 0;
    padding: 0.4rem 1rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-text-dark;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-text-dark;
      color: $color-background;
    }
  }
}
</style>
