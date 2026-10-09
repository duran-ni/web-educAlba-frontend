<template>
  <section class="admin-students-view">
    <h1 class="admin-students-view__title">Alumnos</h1>

    <div class="admin-students-view__search-field">
      <label class="admin-students-view__search-label" for="student-search">
        Buscar alumno
      </label>
      <input
        id="student-search"
        v-model="searchTerm"
        type="search"
        class="admin-students-view__search"
        placeholder="Nombre del alumno…"
      />
    </div>

    <p v-if="status === 'loading'" class="admin-students-view__message">Cargando alumnos…</p>

    <p
      v-else-if="status === 'error'"
      class="admin-students-view__message admin-students-view__message--error"
    >
      No hemos podido cargar los alumnos. Inténtalo de nuevo más tarde.
    </p>

    <p v-else-if="filteredStudents.length === 0" class="admin-students-view__message">
      No se han encontrado alumnos.
    </p>

    <ul v-else class="admin-students-view__items">
      <li v-for="student in filteredStudents" :key="student.id" class="admin-students-view__item">
        <div class="admin-students-view__item-info">
          <p class="admin-students-view__item-name">
            {{ student.firstName }} {{ student.lastName }}
          </p>
          <p class="admin-students-view__item-details">
            {{ student.serviceOfInterest }}
            <span v-if="student.educationalStage"> · {{ student.educationalStage }}</span>
          </p>
        </div>

        <span
          class="admin-students-view__status"
          :class="{ 'admin-students-view__status--pending': student.status === 'PENDING' }"
        >
          {{ student.status === 'ACTIVE' ? 'Al día' : 'Pendiente' }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchStudents } from '@/services/students'

// loading | loaded | error
const status = ref('loading')
const students = ref([])
const searchTerm = ref('')

onMounted(loadStudents)

async function loadStudents() {
  try {
    const response = await fetchStudents()
    students.value = response.data
    status.value = 'loaded'
  } catch {
    status.value = 'error'
  }
}

// Filtra, del lado del frontend, los alumnos cuyo nombre completo contiene
// el texto buscado (sin distinguir mayúsculas/minúsculas); si no hay texto
// escrito, se muestran todos
const filteredStudents = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  if (!term) {
    return students.value
  }

  return students.value.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(term)
  )
})
</script>

<style lang="scss">
.admin-students-view {
  padding: 3rem 1.5rem;

  &__title {
    margin: 0 0 2rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;

    @include respond-to(tablet) {
      font-size: 3.25rem;
    }
  }

  &__search-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-width: 24rem;
    margin-bottom: 2.5rem;
  }

  &__search-label {
    font-family: $font-heading;
    font-size: 0.9rem;
    font-weight: 600;
    color: $color-text-dark;
  }

  &__search {
    padding: 0.6rem 1rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    font: inherit;

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
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
    gap: 1.25rem;
    max-width: 32rem;
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
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__item-details {
    margin: 0;
    font-size: 0.9rem;
    color: $color-text-dark;
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

  &__status--pending {
    background-color: $color-background-alt;
    color: $color-text-dark;
  }
}
</style>
