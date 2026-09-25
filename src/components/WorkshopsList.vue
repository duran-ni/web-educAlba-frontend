<template>
  <section class="workshops-list">
    <p v-if="status === 'loading'" class="workshops-list__message">Cargando talleres…</p>

    <div v-else-if="status === 'has-workshops'" class="workshops-list__grid">
      <WorkshopCard v-for="workshop in workshops" :key="workshop.id" :workshop="workshop" />
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
import { ref, onMounted } from 'vue'
import { fetchWorkshops } from '@/services/workshops'
import WorkshopCard from './WorkshopCard.vue'

const status = ref('loading')
const workshops = ref([])

onMounted(async () => {
  try {
    const response = await fetchWorkshops()
    workshops.value = response.data

    status.value = workshops.value.length > 0 ? 'has-workshops' : 'empty'
  } catch {
    status.value = 'error'
  }
})
</script>

<style lang="scss">
.workshops-list {
  &__message {
    margin: 0;
    color: $color-text-dark;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(desktop) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
