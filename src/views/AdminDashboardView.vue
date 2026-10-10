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
    />

    <dialog ref="dialogRef" class="admin-dashboard-view__dialog" @close="handleDialogClose">
      <WorkshopForm @created="handleWorkshopCreated" @cancel="closeDialog" />
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchDashboardSummary } from '@/services/dashboard'
import { fetchAdminWorkshops, deleteWorkshop, updateWorkshop } from '@/services/workshops'
import { fetchEnrollments, deleteEnrollment } from '@/services/enrollments'
import { useDashboardSummaryStream } from '@/composables/useDashboardSummaryStream'
import AdminWorkshopsList from '@/components/AdminWorkshopsList.vue'
import WorkshopForm from '@/components/WorkshopForm.vue'

// loading | loaded | error
const summaryStatus = ref('loading')
const summary = ref(null)

// loading | loaded | error
const workshopsStatus = ref('loading')
const workshops = ref([])

// loading | loaded | error
const enrollmentsStatus = ref('loading')
const enrollments = ref([])

const dialogRef = ref(null)

onMounted(async () => {
  await Promise.all([loadSummary(), loadWorkshops(), loadEnrollments()])
})

// Se suscribe al stream en tiempo real: cualquier cambio que afecte al
// resumen (desde este panel o desde cualquier otro sitio, como un alumno
// inscribiendose en la vista publica) vuelve a llamar a loadSummary()
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

function openDialog() {
  dialogRef.value.showModal()
}

function closeDialog() {
  dialogRef.value.close()
}

// Al confirmar la creacion (evento "close" del <dialog>, disparado tanto al
// pulsar "Cancelar" como al cerrar con la tecla Esc) ya no hace falta hacer nada
// mas: el cierre en si no borra el taller ya creado
function handleDialogClose() {}

// Se inserta el taller recien creado y se reordena la lista por fecha/hora,
// sin volver a pedirla al backend: evita una peticion de red innecesaria
// para algo que ya tenemos
function handleWorkshopCreated(newWorkshop) {
  workshops.value = [...workshops.value, newWorkshop].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
  )
  closeDialog()
  loadSummary()
}

// Elimina el taller en el backend y, solo si la peticion tiene exito, lo
// quita tambien del listado en memoria, sin volver a pedirlo entero al
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
// solo cambia "active") y, solo si la peticion tiene exito, actualiza
// tambien el listado en memoria, sin volver a pedirlo entero al backend
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

// Elimina la inscripcion en el backend y, solo si la peticion tiene exito,
// la quita tambien del listado en memoria; ademas refresca el KPI de
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
    grid-template-columns: repeat(2, auto);
    justify-items: start;
    gap: 2.5rem;
    margin: 5.5rem;
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
    margin-left: 7rem;
    transform: rotate(4deg);
  }

  &__kpi--workshops {
    margin-left: 5rem;
    background-color: $color-accent-green-soft;
    transform: rotate(-4deg);
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
    margin-right: 16rem;
    transform: translateY(-3rem);
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
