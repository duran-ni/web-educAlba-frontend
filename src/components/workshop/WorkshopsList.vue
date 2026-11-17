<template>
  <section class="workshops-list">
    <p v-if="status === 'loading'" class="workshops-list__message">Cargando talleres…</p>

    <div v-else-if="status === 'has-workshops'" class="workshops-list__grid">
      <WorkshopCard
        v-for="workshop in workshops"
        :key="workshop.id"
        :workshop="workshop"
        :can-enroll="canEnroll"
        :enrolled-workshop-ids="enrolledWorkshopIds"
        @enrolled="handleEnrolled"
      />
    </div>

    <p v-else-if="status === 'empty'" class="workshops-list__message">
      No hay talleres activos actualmente.
    </p>

    <p v-else class="workshops-list__message">
      No hemos podido cargar los talleres. Inténtalo de nuevo más tarde.
    </p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchWorkshops } from '@/services/workshops'
import { fetchMyWorkshops } from '@/services/dashboard'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/config/roles'
import WorkshopCard from './WorkshopCard.vue'

const authStore = useAuthStore()

// Solo un usuario logueado con el rol de familia/alumno tiene un alumno
// propio al que apuntar; un visitante anonimo o un administrador no ven
// el boton "Apuntarme" (el administrador ya tiene su propio flujo de alta)
const canEnroll = computed(
  () => authStore.isAuthenticated && authStore.user?.roles.includes(ROLES.FAMILY)
)

const status = ref('loading')
const workshops = ref([])

// Ids de los talleres en los que el alumno del usuario logueado ya esta
// inscrito, para no repetir el boton "Apuntarme" en esos talleres
const enrolledWorkshopIds = ref([])

onMounted(async () => {
  try {
    const response = await fetchWorkshops()
    workshops.value = response.data

    status.value = workshops.value.length > 0 ? 'has-workshops' : 'empty'
  } catch {
    status.value = 'error'
  }

  if (canEnroll.value) {
    await loadEnrolledWorkshopIds()
  }
})

async function loadEnrolledWorkshopIds() {
  try {
    const response = await fetchMyWorkshops()
    enrolledWorkshopIds.value = response.data.map((myWorkshop) => myWorkshop.workshopId)
  } catch {
    // Si falla, simplemente no se marca ningun taller como "ya apuntado";
    // el usuario puede intentar apuntarse y el backend rechaza duplicados
    enrolledWorkshopIds.value = []
  }
}

// Al apuntarse con exito a un taller, se añade su id a la lista en memoria
// sin volver a pedirla entera al backend
function handleEnrolled(workshopId) {
  enrolledWorkshopIds.value = [...enrolledWorkshopIds.value, workshopId]
}
</script>

<style lang="scss">
.workshops-list {
  margin-top: 5.5rem;

  &__message {
    margin: 0;
    color: $color-text-dark;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 5rem;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(desktop) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
</style>
