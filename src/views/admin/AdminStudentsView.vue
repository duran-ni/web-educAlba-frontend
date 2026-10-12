<template>
  <section class="admin-students-view">
    <div class="admin-students-view__header">
      <div class="admin-students-view__header-top">
        <h1 class="admin-students-view__title">Alumnos</h1>
        <button type="button" class="admin-students-view__new-student" @click="openDialog">
          <span class="material-symbols-outlined" aria-hidden="true">person_add</span>
          + Nuevo Alumno
        </button>
      </div>

      <img src="@/assets/alumnos.jpeg" alt="" class="admin-students-view__header-image" />
    </div>

    <div class="admin-students-view__search-field">
      <label class="admin-students-view__search-label" for="student-search"> Buscar alumno </label>
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
            <th scope="col" class="admin-students-view__cell admin-students-view__cell--head">
              Acciones
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
            <td class="admin-students-view__cell admin-students-view__cell--actions">
              <button
                type="button"
                class="admin-students-view__edit"
                :aria-label="`Editar a ${student.firstName} ${student.lastName}`"
                @click="openEditDialog(student)"
              >
                Editar
              </button>
              <button
                type="button"
                class="admin-students-view__delete"
                :aria-label="`Eliminar a ${student.firstName} ${student.lastName}`"
                @click="handleDeleteClick(student)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog ref="dialogRef" class="admin-students-view__dialog" @close="handleDialogClose">
      <StudentForm
        :key="editingStudent?.id ?? 'new'"
        :student="editingStudent"
        :enrollment="editingStudent ? enrollmentForStudent(editingStudent.id) : null"
        @created="handleStudentSaved"
        @updated="handleStudentSaved"
        @cancel="closeDialog"
      />
    </dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchStudents, deleteStudent } from '@/services/students'
import { fetchEnrollments } from '@/services/enrollments'
import StudentForm from '@/components/student/StudentForm.vue'

// loading | loaded | error
const status = ref('loading')
const students = ref([])
const enrollments = ref([])
const searchTerm = ref('')

const dialogRef = ref(null)
const editingStudent = ref(null)

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
const activeStudents = computed(() =>
  students.value.filter((student) => student.status === 'ACTIVE')
)

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

// Devuelve la inscripción (si existe) del alumno dado, para precargarla en
// StudentForm al editar. Un alumno de este panel, como mucho, tiene una
// inscripción a la vez (ver StudentForm), así que basta con la primera
function enrollmentForStudent(studentId) {
  return enrollments.value.find((enrollment) => enrollment.studentId === studentId) ?? null
}

function openDialog() {
  editingStudent.value = null
  dialogRef.value.showModal()
}

// Abre el mismo dialog que "+ Nuevo Alumno", pero guardando qué alumno se
// quiere editar: el formulario, al recibirlo por prop, precarga sus datos
function openEditDialog(student) {
  editingStudent.value = student
  dialogRef.value.showModal()
}

function closeDialog() {
  dialogRef.value.close()
}

// Al cerrar el dialog (tanto si se guarda como si se cancela o se pulsa
// Esc) se limpia el alumno en edición, para que la próxima vez que se abra
// "+ Nuevo Alumno" no arrastre datos de una edición anterior
function handleDialogClose() {
  editingStudent.value = null
}

// Sirve tanto para alta como para edición: en ambos casos lo más sencillo
// y fiable es volver a pedir todo al backend, porque un alta puede incluir
// una inscripción a un taller que también afecta a la columna de
// "Talleres a los que asiste"
function handleStudentSaved() {
  closeDialog()
  loadData()
}

// Pide confirmación antes de avisar al backend, para evitar que un clic
// accidental dé de baja a un alumno sin darse cuenta
async function handleDeleteClick(student) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar a "${student.firstName} ${student.lastName}"? Esta acción no se puede deshacer.`
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteStudent(student.id)
    students.value = students.value.filter((item) => item.id !== student.id)
  } catch (error) {
    if (error.response?.status === 409) {
      window.alert(
        'No se puede eliminar este alumno porque tiene inscripciones a talleres. Elimina antes sus inscripciones desde el panel de Talleres.'
      )
    } else {
      window.alert('No se ha podido eliminar el alumno. Inténtalo de nuevo.')
    }
  }
}
</script>

<style lang="scss">
.admin-students-view {
  padding: 3rem 1.5rem;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;

    @include respond-to(desktop) {
      flex-direction: row;
      align-items: center;
      gap: 30rem;
    }
  }

  &__header-top {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  &__new-student {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-background;
    font-family: $font-heading;
    font-weight: 600;
    box-shadow: 4px 4px 0 0 $color-text-dark;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover,
    &:focus-visible {
      opacity: 0.9;
    }
  }

  &__header-image {
    width: 100%;
    max-width: 20rem;
    height: auto;
    aspect-ratio: 2 / 1;
    object-fit: cover;
    border-radius: 999px;
    @include doodle-frame;

    @include respond-to(desktop) {
      width: 32rem;
      height: 16rem;
      flex-shrink: 0;
      transform: rotate(5deg) translateY(2rem) translateX(-4rem);
    }
  }

  &__title {
    margin: 0 0 3rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;

    @include respond-to(tablet) {
      font-size: 4.25rem;
    }

    @include respond-to(desktop) {
      margin-left: 5.5rem;
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
    border-bottom: 2px solid $color-background-alt;

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

  &__cell--actions {
    display: flex;
    gap: 0.75rem;
  }

  &__edit,
  &__delete {
    padding: 0.4rem 0.9rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background: none;
    font-family: $font-heading;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover,
    &:focus-visible {
      opacity: 0.75;
    }
  }

  &__edit {
    color: $color-primary;
  }

  &__delete {
    color: $color-error;
  }

  &__dialog {
    margin: auto;
    width: min(90vw, 40rem);
    padding: 2rem;
    border: 2px solid $color-text-dark;
    border-radius: 1rem;
    box-shadow: 4px 4px 0 0 $color-text-dark;

    &::backdrop {
      background-color: rgba($color-text-dark, 0.5);
    }
  }
}
</style>
