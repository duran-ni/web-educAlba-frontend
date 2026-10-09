<template>
  <section class="admin-workshops-list">
    <h2 class="admin-workshops-list__title">Talleres</h2>

    <p v-if="status === 'loading'" class="admin-workshops-list__message">Cargando talleres…</p>

    <p
      v-else-if="status === 'error'"
      class="admin-workshops-list__message admin-workshops-list__message--error"
    >
      No hemos podido cargar los talleres. Inténtalo de nuevo más tarde.
    </p>

    <p v-else-if="workshops.length === 0" class="admin-workshops-list__message">
      Todavía no hay talleres creados.
    </p>

    <ul v-else class="admin-workshops-list__items">
      <li v-for="workshop in workshops" :key="workshop.id" class="admin-workshops-list__item">
        <div class="admin-workshops-list__item-info">
          <p class="admin-workshops-list__item-name">{{ workshop.name }}</p>
          <p class="admin-workshops-list__item-details">
            {{ formatWorkshopDate(workshop.date) }} · {{ formatWorkshopTime(workshop.time) }}
            <span v-if="workshop.room"> · {{ workshop.room }}</span>
          </p>
        </div>

        <div class="admin-workshops-list__item-actions">
          <span
            class="admin-workshops-list__status"
            :class="{ 'admin-workshops-list__status--inactive': !workshop.active }"
          >
            {{ workshop.active ? 'Activo' : 'Inactivo' }}
          </span>

          <button
            type="button"
            class="admin-workshops-list__delete"
            @click="handleDeleteClick(workshop)"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'
import { formatWorkshopTime } from '@/utils/formatWorkshopTime'

defineProps({
  status: {
    type: String,
    required: true,
  },
  workshops: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['delete'])

// Pide confirmacion antes de avisar al componente padre, para evitar que
// un clic accidental borre un taller sin darse cuenta
function handleDeleteClick(workshop) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar el taller "${workshop.name}"? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete', workshop.id)
  }
}
</script>

<style lang="scss">
.admin-workshops-list {
  margin-top: 8rem;

  &__title {
    margin: 0 0 3rem;
    margin-left: 12rem;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-error;
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
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    max-width: 32rem;
    margin-left: 4rem;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background-color: $color-background-soft;
    @include doodle-frame;
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

  &__item-details {
    margin: 0;
    font-size: 0.95rem;
    color: $color-text-dark;
  }

  &__item-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__status {
    flex-shrink: 0;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background-color: $color-accent-green-soft;
    font-family: $font-heading;
    font-size: 0.75rem;
    font-weight: 700;
    color: $color-green-dark;
  }

  &__status--inactive {
    background-color: $color-background-alt;
    color: $color-text-dark;
  }

  &__delete {
    flex-shrink: 0;
    padding: 0.25rem 0.75rem;
    border: 2px solid $color-error;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-error;
    font-family: $font-heading;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-error;
      color: $color-background;
    }
  }
}
</style>
