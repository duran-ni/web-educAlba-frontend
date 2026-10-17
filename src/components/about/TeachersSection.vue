<template>
  <section class="teachers-section">
    <h2 class="teachers-section__heading">Nuestro Equipo</h2>

    <p v-if="status === 'loading'" class="teachers-section__message">Cargando el equipo…</p>

    <div v-else-if="status === 'has-teachers'" class="teachers-section__grid">
      <TeacherCard v-for="teacher in teachers" :key="teacher.id" :teacher="teacher" />
    </div>

    <p v-else-if="status === 'empty'" class="teachers-section__message">
      Todavía no hay profesores publicados.
    </p>

    <p v-else class="teachers-section__message">
      No hemos podido cargar el equipo. Inténtalo de nuevo más tarde.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchTeachers } from '@/services/teachers'
import TeacherCard from './TeacherCard.vue'

// loading | has-teachers | empty | error
const status = ref('loading')
const teachers = ref([])

onMounted(async () => {
  try {
    const response = await fetchTeachers()
    teachers.value = response.data
    status.value = teachers.value.length > 0 ? 'has-teachers' : 'empty'
  } catch {
    status.value = 'error'
  }
})
</script>

<style lang="scss">
.teachers-section {
  padding: 3rem 0;

  &__heading {
    margin: 0 0 3rem;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-text-dark;
    text-align: center;
  }

  &__message {
    margin: 0;
    color: $color-text-dark;
    text-align: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @include respond-to(tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to(desktop) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
