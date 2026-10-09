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
        <div class="admin-workshops-list__item-row">
          <div class="admin-workshops-list__item-info">
            <p class="admin-workshops-list__item-name">{{ workshop.name }}</p>
            <p class="admin-workshops-list__item-details">
              {{ formatWorkshopDate(workshop.date) }} · {{ formatWorkshopTime(workshop.time) }}
              <span v-if="workshop.room"> · {{ workshop.room }}</span>
            </p>
          </div>

          <div class="admin-workshops-list__item-actions">
            <button
              type="button"
              class="admin-workshops-list__status"
              :class="{ 'admin-workshops-list__status--inactive': !workshop.active }"
              @click="handleToggleActiveClick(workshop)"
            >
              {{ workshop.active ? 'Activo' : 'Inactivo' }}
            </button>

            <button
              type="button"
              class="admin-workshops-list__enrollments-toggle"
              :aria-expanded="isExpanded(workshop.id)"
              @click="toggleEnrollments(workshop.id)"
            >
              Alumnos inscritos ({{ enrollmentsForWorkshop(workshop.id).length }})
            </button>

            <button
              type="button"
              class="admin-workshops-list__delete"
              @click="handleDeleteClick(workshop)"
            >
              Eliminar
            </button>
          </div>
        </div>

        <ul v-if="isExpanded(workshop.id)" class="admin-workshops-list__enrollments">
          <li
            v-if="enrollmentsForWorkshop(workshop.id).length === 0"
            class="admin-workshops-list__enrollments-empty"
          >
            Todavía no hay alumnos inscritos en este taller.
          </li>

          <li
            v-for="enrollment in enrollmentsForWorkshop(workshop.id)"
            :key="enrollment.id"
            class="admin-workshops-list__enrollment"
          >
            <span class="admin-workshops-list__enrollment-name">
              {{ enrollment.studentFullName }}
            </span>

            <button
              type="button"
              class="admin-workshops-list__enrollment-delete"
              @click="handleDeleteEnrollmentClick(enrollment)"
            >
              Eliminar
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { formatWorkshopDate } from '@/utils/formatWorkshopDate'
import { formatWorkshopTime } from '@/utils/formatWorkshopTime'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  workshops: {
    type: Array,
    required: true,
  },
  enrollments: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['delete', 'toggle-active', 'delete-enrollment'])

// Guarda los ids de los talleres cuyo listado de inscritos esta desplegado;
// un Set permite tener varios talleres abiertos a la vez sin duplicados
const expandedWorkshopIds = ref(new Set())

function isExpanded(workshopId) {
  return expandedWorkshopIds.value.has(workshopId)
}

function toggleEnrollments(workshopId) {
  const next = new Set(expandedWorkshopIds.value)

  if (next.has(workshopId)) {
    next.delete(workshopId)
  } else {
    next.add(workshopId)
  }

  expandedWorkshopIds.value = next
}

// Filtra, del lado del frontend, las inscripciones que pertenecen a este
// taller concreto; evita pedir al backend un listado distinto por cada taller
function enrollmentsForWorkshop(workshopId) {
  return props.enrollments.filter((enrollment) => enrollment.workshopId === workshopId)
}

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

// Pide confirmacion solo al desactivar (deja de verse en la web publica);
// activar no tiene efecto "destructivo", asi que no hace falta confirmar
function handleToggleActiveClick(workshop) {
  if (workshop.active) {
    const confirmed = window.confirm(
      `¿Seguro que quieres desactivar el taller "${workshop.name}"? Dejará de mostrarse en la web pública.`
    )

    if (!confirmed) {
      return
    }
  }

  emit('toggle-active', workshop)
}

// Pide confirmacion antes de eliminar la inscripcion de un alumno concreto,
// para dar de baja a quien avisa que no puede asistir al taller
function handleDeleteEnrollmentClick(enrollment) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar la inscripción de "${enrollment.studentFullName}"? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete-enrollment', enrollment.id)
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
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background-color: $color-background-soft;
    @include doodle-frame;
  }

  &__item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
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
    flex-wrap: wrap;
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
    border: none;
    cursor: pointer;
    font: inherit;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-green-dark;
      color: $color-background;
    }
  }

  &__status--inactive {
    background-color: $color-background-alt;
    color: $color-text-dark;

    &:hover,
    &:focus-visible {
      background-color: $color-text-dark;
      color: $color-background;
    }
  }

  &__enrollments-toggle {
    flex-shrink: 0;
    padding: 0.40rem 0.75rem;
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

  &__delete {
    flex-shrink: 0;
    padding: 0.40rem 1rem;
    border: 2px solid $color-error;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-error;
    font-family: $font-heading;
    font-size: 0.85rem;
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

  &__enrollments {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
  }

  &__enrollments-empty {
    color: $color-text-dark;
    font-size: 0.9rem;
  }

  &__enrollment {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    background-color: $color-background;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
  }

  &__enrollment-name {
    color: $color-text-dark;
    font-size: 1rem;
  }

  &__enrollment-delete {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    border: 1px solid $color-error;
    border-radius: 999px;
    background-color: transparent;
    color: $color-error;
    font-size: 0.85rem;
    font-weight: 600;
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
