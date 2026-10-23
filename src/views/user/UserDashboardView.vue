<template>
  <section class="user-dashboard-view">
    <p v-if="profileStatus === 'loading'" class="user-dashboard-view__message">Cargando…</p>

    <p
      v-else-if="profileStatus === 'error'"
      class="user-dashboard-view__message user-dashboard-view__message--error"
    >
      No hemos podido cargar tus datos. Inténtalo de nuevo más tarde.
    </p>

    <div v-else class="user-dashboard-view__greeting">
      <h1 class="user-dashboard-view__title">¡Hola, {{ profile.firstName }}!</h1>
      <p class="user-dashboard-view__subtitle">
        Tu cuaderno de aventuras y descubrimientos de hoy.
      </p>
    </div>

    <div class="user-dashboard-view__workshops">
      <h2 class="user-dashboard-view__workshops-title">Tus talleres</h2>

      <p v-if="workshopsStatus === 'loading'" class="user-dashboard-view__message">
        Cargando tus talleres…
      </p>

      <p
        v-else-if="workshopsStatus === 'error'"
        class="user-dashboard-view__message user-dashboard-view__message--error"
      >
        No hemos podido cargar tus talleres. Inténtalo de nuevo más tarde.
      </p>

      <p v-else-if="workshopsStatus === 'empty'" class="user-dashboard-view__message">
        ¡No estás apuntado a ningún taller! Mira los que tenemos disponibles en la sección
        <RouterLink :to="{ name: 'workshops' }" class="user-dashboard-view__link"
          >Talleres</RouterLink
        >
        y si te gusta alguno consulta a tus padres si te puedes apuntar.
      </p>

      <div v-else class="user-dashboard-view__workshops-grid">
        <MyWorkshopCard
          v-for="enrollment in workshops"
          :key="enrollment.enrollmentId"
          :enrollment="enrollment"
        />
      </div>
    </div>

    <div class="user-dashboard-view__materials">
      <h2 class="user-dashboard-view__materials-title">Tus materiales</h2>

      <p v-if="materialsStatus === 'loading'" class="user-dashboard-view__message">
        Cargando tus materiales…
      </p>

      <p
        v-else-if="materialsStatus === 'error'"
        class="user-dashboard-view__message user-dashboard-view__message--error"
      >
        No hemos podido cargar tus materiales. Inténtalo de nuevo más tarde.
      </p>

      <p v-else-if="materialsStatus === 'empty'" class="user-dashboard-view__message">
        Todavía no tienes ningún material disponible.
      </p>

      <div v-else class="user-dashboard-view__materials-list">
        <MyMaterialRow v-for="material in materials" :key="material.id" :material="material" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchMyProfile, fetchMyWorkshops, fetchMyMaterials } from '@/services/dashboard'
import { RouterLink } from 'vue-router'
import MyWorkshopCard from '@/components/workshop/MyWorkshopCard.vue'
import MyMaterialRow from '@/components/workshop/MyMaterialRow.vue'

// loading | loaded | error
const profileStatus = ref('loading')
const profile = ref(null)

// loading | has-workshops | empty | error
const workshopsStatus = ref('loading')
const workshops = ref([])

// loading | has-materials | empty | error
const materialsStatus = ref('loading')
const materials = ref([])

onMounted(async () => {
  await Promise.all([loadProfile(), loadWorkshops(), loadMaterials()])
})

async function loadProfile() {
  try {
    const response = await fetchMyProfile()
    profile.value = response.data
    profileStatus.value = 'loaded'
  } catch {
    profileStatus.value = 'error'
  }
}

async function loadWorkshops() {
  try {
    const response = await fetchMyWorkshops()
    workshops.value = response.data
    workshopsStatus.value = workshops.value.length > 0 ? 'has-workshops' : 'empty'
  } catch {
    workshopsStatus.value = 'error'
  }
}

async function loadMaterials() {
  try {
    const response = await fetchMyMaterials()
    materials.value = response.data
    materialsStatus.value = materials.value.length > 0 ? 'has-materials' : 'empty'
  } catch {
    materialsStatus.value = 'error'
  }
}
</script>

<style lang="scss">
.user-dashboard-view {
  padding: 3rem 1.5rem;

  &__message {
    color: $color-text-dark;
    font-family: $font-doodle;
    font-size: 1.125rem;
  }

  &__link {
    color: $color-primary;
    font-weight: 600;
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
    margin: 2.5rem 0 0 2.5rem;
    font-family: $font-doodle;
    font-size: 1.125rem;
    color: $color-text-dark;
  }

  &__workshops {
    margin-top: 5.5rem;
  }

  &__workshops-title {
    margin: 0 0 2rem;
    font-family: $font-doodle;
    font-size: 1.75rem;
    color: $color-green-dark;

    @include respond-to(tablet) {
      font-size: 2.25rem;
    }
  }

  &__workshops-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__materials {
    margin-top: 5.5rem;
  }

  &__materials-title {
    margin: 0 0 2rem;
    font-family: $font-doodle;
    font-size: 1.75rem;
    color: $color-error;

    @include respond-to(tablet) {
      font-size: 2.25rem;
    }
  }

  &__materials-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
