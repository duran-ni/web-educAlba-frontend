<template>
  <section class="user-dashboard-view">
    <p v-if="status === 'loading'" class="user-dashboard-view__message">Cargando…</p>

    <p
      v-else-if="status === 'error'"
      class="user-dashboard-view__message user-dashboard-view__message--error"
    >
      No hemos podido cargar tus datos. Inténtalo de nuevo más tarde.
    </p>

    <div v-else class="user-dashboard-view__greeting">
      <h1 class="user-dashboard-view__title">¡Hola, {{ profile.firstName }}!</h1>
      <p class="user-dashboard-view__subtitle">Tu cuaderno de aventuras y descubrimientos de hoy.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchMyProfile } from '@/services/dashboard'

// loading | loaded | error
const status = ref('loading')
const profile = ref(null)

onMounted(loadProfile)

async function loadProfile() {
  try {
    const response = await fetchMyProfile()
    profile.value = response.data
    status.value = 'loaded'
  } catch {
    status.value = 'error'
  }
}
</script>

<style lang="scss">
.user-dashboard-view {
  padding: 3rem 1.5rem;

  &__message {
    color: $color-text-dark;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }

  &__greeting {
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

  &__subtitle {
    margin: 1.5rem 0 0;
    font-family: $font-doodle;
    color: $color-text-dark;
    font-size: 1.125rem;
    margin-left: 4rem;
  }
}
</style>
