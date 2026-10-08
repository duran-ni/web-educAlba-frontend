<template>
  <section class="admin-dashboard-view">
    <h1 class="admin-dashboard-view__title">Panel de Administración</h1>

    <p v-if="status === 'loading'" class="admin-dashboard-view__message">Cargando indicadores…</p>

    <p
      v-else-if="status === 'error'"
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
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchDashboardSummary } from '@/services/dashboard'

// loading | loaded | error
const status = ref('loading')
const summary = ref(null)

onMounted(async () => {
  try {
    const response = await fetchDashboardSummary()
    summary.value = response.data
    status.value = 'loaded'
  } catch {
    status.value = 'error'
  }
})
</script>

<style lang="scss">
.admin-dashboard-view {
  padding: 3rem 1.5rem;

  &__title {
    margin: 3rem 0 2rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;
    transform: rotate(-5deg);
    display: inline-block;

    @include respond-to(tablet) {
      font-size: 3.25rem;
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
    justify-items: start;
    gap: 4rem;
    margin: 3.5rem;
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
    margin-left: 3rem;
    transform: rotate(3deg);
  }

  &__kpi--workshops {
    margin-left: 9rem;
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
}
</style>
