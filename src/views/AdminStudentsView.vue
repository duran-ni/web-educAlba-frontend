<template>
  <section class="admin-students-view">
    <div class="admin-students-view__header">
      <h1 class="admin-students-view__title">Alumnos</h1>

      <img
        src="@/assets/alumnos.jpeg"
        alt=""
        class="admin-students-view__header-image"
      />
    </div>

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

    <div v-else class="admin-students-view__table-wrapper">
      <table class="admin-students-view__table">
        <caption class="admin-students-view__table-caption">
          Listado de alumnos de Refuerzo dados de alta
        </caption>
        <thead>
          <tr class="admin-students-view__row admin-students-view__row--head">
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Nombre
            </th>
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Apellidos
            </th>
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Edad
            </th>
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Teléfono
            </th>
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Servicio
            </th>
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Etapa educativa
            </th>
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Talleres a los que asiste
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            class="admin-students-view__row"
          >
            <td class="admin-students-view__cell">{{ student.firstName }}</td>
            <td class="admin-students-view__cell">{{ student.lastName }}</td>
            <td class="admin-students-view__cell">{{ student.age ?? '—' }}</td>
            <td class="admin-students-view__cell">{{ student.phone ?? '—' }}</td>
            <td class="admin-students-view__cell">{{ student.serviceOfInterest ?? '—' }}</td>
            <td class="admin-students-view__cell">{{ student.educationalStage ?? '—' }}</td>
            <td class="admin-students-view__cell">
              {{ workshopsForStudent(student.id).join(', ') || '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchStudents } from '@/services/students'
import { fetchEnrollments } from '@/services/enrollments'

// loading | loaded | error
const status = ref('loading')
const students = ref([])
const enrollments = ref([])
const searchTerm = ref('')

onMounted(loadData)

// Carga en paralelo los alumnos y las inscripciones, ya que la vista
// necesita ambas colecciones para cruzar cada alumno con sus talleres
async function loadData() {
  try {
    const [studentsResponse, enrollmentsResponse] = await Promise.all([
      fetchStudents(),
      fetchEnrollments(),
    ])
    students.value = studentsResponse.data
    enrollments.value = enrollmentsResponse.data
    status.value = 'loaded'
  } catch {
    status.value = 'error'
  }
}

// Solo se muestran los alumnos con alta formal (clases de Refuerzo); los
// que únicamente se han apuntado a un taller puntual quedan como PENDING
// y se gestionan desde el panel de Talleres, no desde esta vista
const activeStudents = computed(() => students.value.filter((student) => student.status === 'ACTIVE'))

// Filtra, del lado del frontend, los alumnos activos cuyo nombre completo
// contiene el texto buscado (sin distinguir mayúsculas/minúsculas); si no
// hay texto escrito, se muestran todos los alumnos activos
const filteredStudents = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  if (!term) {
    return activeStudents.value
  }

  return activeStudents.value.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(term)
  )
})

// Cruza las inscripciones con el alumno dado y devuelve los nombres de los
// talleres a los que asiste, para mostrarlos junto a sus datos
function workshopsForStudent(studentId) {
  return enrollments.value
    .filter((enrollment) => enrollment.studentId === studentId)
    .map((enrollment) => enrollment.workshopName)
}
</script>

<style lang="scss">
.admin-students-view {
  padding: 3rem 1.5rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 30rem;
    margin-bottom: 2rem;
  }

  &__header-image {
    width: 32rem;
    height: 16rem;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 999px;
    transform: rotate(5deg)translateY(2rem) translateX(-4rem);
    @include doodle-frame;
  }

  &__title {
    margin: 0 0 3rem 5.5rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;

    @include respond-to(tablet) {
      font-size: 4.25rem;
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
    font-size: 1.4rem;
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

  // Envuelve la tabla en un contenedor con scroll horizontal propio, para
  // que en pantallas pequeñas (móvil) la tabla no desborde la página: se
  // puede desplazar solo ella en lugar de toda la vista
  &__table-wrapper {
    overflow-x: auto;
    @include doodle-frame;
  }

  &__table {
    width: 100%;
    min-width: 50rem;
    border-collapse: collapse;
    background-color: $color-accent-purple-soft;
  }

  // Oculta visualmente el <caption> mientras lo mantiene disponible para
  // lectores de pantalla: describe la tabla sin ocupar espacio en pantalla
  &__table-caption {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__row {
    border-bottom: 1px solid $color-background-alt;

    &:last-child {
      border-bottom: none;
    }
  }

  &__cell {
    padding: 0.85rem 1.25rem;
    text-align: left;
    font-size: 1.2rem;
    color: $color-text-dark;
    white-space: nowrap;
  }

  &__cell--head {
    font-family: $font-heading;
    font-size: 1rem;
    font-weight: 700;
    color: $color-primary;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
}
</style>
