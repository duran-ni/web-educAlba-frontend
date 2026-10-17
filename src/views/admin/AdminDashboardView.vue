<template>
  <section class="admin-dashboard-view">
    <div class="admin-dashboard-view__header">
      <h1 class="admin-dashboard-view__title">Panel de Administración</h1>
      <button type="button" class="admin-dashboard-view__new-workshop" @click="openDialog">
        <span class="material-symbols-outlined" aria-hidden="true">palette</span>
        + Nuevo Taller
      </button>
    </div>

    <p v-if="summaryStatus === 'loading'" class="admin-dashboard-view__message">
      Cargando indicadores…
    </p>

    <p
      v-else-if="summaryStatus === 'error'"
      class="admin-dashboard-view__message admin-dashboard-view__message--error"
    >
      No hemos podido cargar los indicadores. Inténtalo de nuevo más tarde.
    </p>

    <div v-else class="admin-dashboard-view__kpis">
      <article class="admin-dashboard-view__kpi admin-dashboard-view__kpi--students">
        <p class="admin-dashboard-view__kpi-line">
          <span class="admin-dashboard-view__kpi-value admin-dashboard-view__kpi-value--dark">
            {{ summary.totalEnrolledStudents }}
          </span>
          <span class="admin-dashboard-view__kpi-label">Alumnos inscritos</span>
        </p>
      </article>

      <article class="admin-dashboard-view__kpi admin-dashboard-view__kpi--workshops">
        <p class="admin-dashboard-view__kpi-line">
          <span class="admin-dashboard-view__kpi-value">{{ summary.totalActiveWorkshops }}</span>
          <span class="admin-dashboard-view__kpi-label">Talleres activos</span>
        </p>
      </article>
    </div>

    <AdminWorkshopsList
      :status="workshopsStatus"
      :workshops="workshops"
      :enrollments="enrollments"
      @delete="handleWorkshopDeleted"
      @toggle-active="handleWorkshopToggleActive"
      @delete-enrollment="handleEnrollmentDeleted"
      @edit="openEditDialog"
    />

    <div class="admin-dashboard-view__teachers-header">
      <button type="button" class="admin-dashboard-view__new-teacher" @click="openTeacherDialog">
        <span class="material-symbols-outlined" aria-hidden="true">person_add</span>
        + Nuevo Profesor
      </button>
    </div>

    <AdminTeachersList
      :status="teachersStatus"
      :teachers="teachers"
      @delete="handleTeacherDeleted"
      @edit="openEditTeacherDialog"
    />

    <dialog ref="dialogRef" class="admin-dashboard-view__dialog" @close="handleDialogClose">
      <WorkshopForm
        :key="editingWorkshop?.id ?? 'new'"
        :workshop="editingWorkshop"
        @created="handleWorkshopCreated"
        @updated="handleWorkshopUpdated"
        @cancel="closeDialog"
      />
    </dialog>

    <dialog
      ref="teacherDialogRef"
      class="admin-dashboard-view__dialog"
      @close="handleTeacherDialogClose"
    >
      <TeacherForm
        :key="editingTeacher?.id ?? 'new'"
        :teacher="editingTeacher"
        @created="handleTeacherCreated"
        @updated="handleTeacherUpdated"
        @cancel="closeTeacherDialog"
      />
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchDashboardSummary } from '@/services/dashboard'
import { fetchAdminWorkshops, deleteWorkshop, updateWorkshop } from '@/services/workshops'
import { fetchEnrollments, deleteEnrollment } from '@/services/enrollments'
import { fetchAdminTeachers, deleteTeacher } from '@/services/teachers'
import { useDashboardSummaryStream } from '@/composables/useDashboardSummaryStream'
import AdminWorkshopsList from '@/components/workshop/AdminWorkshopsList.vue'
import WorkshopForm from '@/components/workshop/WorkshopForm.vue'
import AdminTeachersList from '@/components/teacher/AdminTeachersList.vue'
import TeacherForm from '@/components/teacher/TeacherForm.vue'

// loading | loaded | error
const summaryStatus = ref('loading')
const summary = ref(null)

// loading | loaded | error
const workshopsStatus = ref('loading')
const workshops = ref([])

// loading | loaded | error
const enrollmentsStatus = ref('loading')
const enrollments = ref([])

// loading | loaded | error
const teachersStatus = ref('loading')
const teachers = ref([])

const dialogRef = ref(null)
const editingWorkshop = ref(null)

const teacherDialogRef = ref(null)
const editingTeacher = ref(null)

onMounted(async () => {
  await Promise.all([loadSummary(), loadWorkshops(), loadEnrollments(), loadTeachers()])
})

// Se suscribe al stream en tiempo real: cualquier cambio que afecte al
// resumen (desde este panel o desde cualquier otro sitio, como un alumno
// inscribiéndose en la vista pública) vuelve a llamar a loadSummary()
useDashboardSummaryStream(loadSummary)

async function loadSummary() {
  try {
    const response = await fetchDashboardSummary()
    summary.value = response.data
    summaryStatus.value = 'loaded'
  } catch {
    summaryStatus.value = 'error'
  }
}

async function loadWorkshops() {
  try {
    const response = await fetchAdminWorkshops()
    workshops.value = response.data
    workshopsStatus.value = 'loaded'
  } catch {
    workshopsStatus.value = 'error'
  }
}

async function loadEnrollments() {
  try {
    const response = await fetchEnrollments()
    enrollments.value = response.data
    enrollmentsStatus.value = 'loaded'
  } catch {
    enrollmentsStatus.value = 'error'
  }
}

// Pide al backend el listado completo de profesores para el panel de Admin
async function loadTeachers() {
  try {
    const response = await fetchAdminTeachers()
    teachers.value = response.data
    teachersStatus.value = 'loaded'
  } catch {
    teachersStatus.value = 'error'
  }
}

function openDialog() {
  editingWorkshop.value = null
  dialogRef.value.showModal()
}

// Abre el mismo dialog que "+ Nuevo Taller", pero guardando qué taller se
// quiere editar: el formulario, al recibirlo por prop, precarga sus datos
function openEditDialog(workshop) {
  editingWorkshop.value = workshop
  dialogRef.value.showModal()
}

function closeDialog() {
  dialogRef.value.close()
}

// Al cerrar el dialog (tanto si se guarda como si se cancela o se pulsa
// Esc) se limpia el taller en edición, para que la proxima vez que se abra
// "+ Nuevo Taller" no arrastre datos de una edición anterior
function handleDialogClose() {
  editingWorkshop.value = null
}

// Abre el dialog de "+ Nuevo Profesor", sin ningún profesor precargado
function openTeacherDialog() {
  editingTeacher.value = null
  teacherDialogRef.value.showModal()
}

// Abre el mismo dialog, pero guardando que profesor se quiere editar: el
// formulario, al recibirlo por prop, precarga sus datos
function openEditTeacherDialog(teacher) {
  editingTeacher.value = teacher
  teacherDialogRef.value.showModal()
}

function closeTeacherDialog() {
  teacherDialogRef.value.close()
}

// Al cerrar el dialog de profesores se limpia el profesor en edición, para
// que la próxima vez que se abra "+ Nuevo Profesor" no arrastre datos de
// una edición anterior
function handleTeacherDialogClose() {
  editingTeacher.value = null
}

// Se inserta el taller recién creado y se reordena la lista por fecha/hora,
// sin volver a pedirla al backend: evita una petición de red innecesaria
// para algo que ya tenemos
function handleWorkshopCreated(newWorkshop) {
  workshops.value = [...workshops.value, newWorkshop].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
  )
  closeDialog()
  loadSummary()
}

// Sustituye el taller editado en el listado por su versión actualizada y
// reordena por fecha/hora, por si la edición ha cambiado la fecha o la hora
function handleWorkshopUpdated(updatedWorkshop) {
  workshops.value = workshops.value
    .map((workshop) => (workshop.id === updatedWorkshop.id ? updatedWorkshop : workshop))
    .sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
    )
  closeDialog()
  loadSummary()
}

// Elimina el taller en el backend y, solo si la petición tiene éxito, lo
// quita también del listado en memoria, sin volver a pedirlo entero al
// backend
async function handleWorkshopDeleted(id) {
  try {
    await deleteWorkshop(id)
    workshops.value = workshops.value.filter((workshop) => workshop.id !== id)
    loadSummary()
  } catch (error) {
    if (error.response?.status === 409) {
      window.alert(
        'No se puede eliminar este taller porque tiene alumnos inscritos. Desactívalo en su lugar.'
      )
    } else {
      window.alert('No se ha podido eliminar el taller. Inténtalo de nuevo.')
    }
  }
}

// Activa/desactiva el taller en el backend (PUT con el taller completo,
// solo cambia "active") y, solo si la petición tiene éxito, actualiza
// también el listado en memoria, sin volver a pedirlo entero al backend
async function handleWorkshopToggleActive(workshop) {
  try {
    const response = await updateWorkshop(workshop.id, { ...workshop, active: !workshop.active })
    workshops.value = workshops.value.map((item) =>
      item.id === workshop.id ? response.data : item
    )
    loadSummary()
  } catch {
    window.alert('No se ha podido cambiar el estado del taller. Inténtalo de nuevo.')
  }
}

// Elimina la inscripción en el backend y, solo si la petición tiene éxito,
// la quita también del listado en memoria; además refresca el KPI de
// alumnos inscritos, igual que al crear/eliminar un taller
async function handleEnrollmentDeleted(id) {
  try {
    await deleteEnrollment(id)
    enrollments.value = enrollments.value.filter((enrollment) => enrollment.id !== id)
    loadSummary()
  } catch {
    window.alert('No se ha podido eliminar la inscripción. Inténtalo de nuevo.')
  }
}

// Se inserta el profesor recién creado al final del listado, sin volver a
// pedirlo entero al backend
function handleTeacherCreated(newTeacher) {
  teachers.value = [...teachers.value, newTeacher]
  closeTeacherDialog()
}

// Sustituye el profesor editado en el listado por su versión actualizada
function handleTeacherUpdated(updatedTeacher) {
  teachers.value = teachers.value.map((teacher) =>
    teacher.id === updatedTeacher.id ? updatedTeacher : teacher
  )
  closeTeacherDialog()
}

// Elimina el profesor en el backend y, solo si la petición tiene éxito, lo
// quita también del listado en memoria
async function handleTeacherDeleted(id) {
  try {
    await deleteTeacher(id)
    teachers.value = teachers.value.filter((teacher) => teacher.id !== id)
  } catch {
    window.alert('No se ha podido eliminar el profesor. Inténtalo de nuevo.')
  }
}
</script>

<style lang="scss">
.admin-dashboard-view {
  padding: 3rem 1.5rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin: 3rem 0 2rem;
  }

  &__title {
    margin: 0;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;
    transform: rotate(-5deg);
    display: inline-block;

    @include respond-to(tablet) {
      font-size: 3.5rem;
    }
  }

  &__message {
    color: $color-text-dark;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }

  &__kpis {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2.5rem;
    margin: 2rem 0;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, auto);
      justify-items: start;
      margin: 5.5rem;
    }
  }

  &__kpi {
    width: 100%;
    max-width: 28rem;
    padding: 1.75rem 2.5rem;
    background-color: $color-accent-pink;
    text-align: center;
    @include doodle-frame;
  }

  &__kpi--students {
    @include respond-to(tablet) {
      margin-left: 7rem;
      transform: rotate(4deg);
    }
  }

  &__kpi--workshops {
    background-color: $color-accent-green-soft;

    @include respond-to(tablet) {
      margin-left: 5rem;
      transform: rotate(-4deg);
    }
  }

  &__kpi-line {
    margin: 0;
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__kpi-value {
    margin: 0;
    font-family: $font-doodle;
    font-size: 2.75rem;
    font-weight: 700;
    color: $color-text-dark;
  }

  &__kpi-value--dark {
    color: $color-text-dark;
  }

  &__kpi-label {
    margin: 0;
    font-family: $font-doodle;
    font-style: italic;
    font-size: 1.25rem;
    color: $color-primary;
    font-weight: 700;
  }

  &__new-workshop {
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

    @include respond-to(tablet) {
      margin-right: 16rem;
      transform: translateY(-3rem);
    }

    &:hover,
    &:focus-visible {
      opacity: 0.9;
    }
  }

  &__teachers-header {
    display: flex;
    justify-content: center;
    margin-top: 5rem;

    @include respond-to(tablet) {
      justify-content: flex-end;
      margin-right: 10rem;
    }
  }

  &__new-teacher {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-accent-green-soft;
    color: $color-text-dark;
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
