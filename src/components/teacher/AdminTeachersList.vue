<template>
  <section class="admin-teachers-list">
    <h2 class="admin-teachers-list__title">Profesores</h2>

    <p v-if="status === 'loading'" class="admin-teachers-list__message">Cargando profesores…</p>

    <p
      v-else-if="status === 'error'"
      class="admin-teachers-list__message admin-teachers-list__message--error"
    >
      No hemos podido cargar los profesores. Inténtalo de nuevo más tarde.
    </p>

    <p v-else-if="teachers.length === 0" class="admin-teachers-list__message">
      Todavía no hay profesores creados.
    </p>

    <ul v-else class="admin-teachers-list__items">
      <li v-for="teacher in teachers" :key="teacher.id" class="admin-teachers-list__item">
        <div class="admin-teachers-list__item-info">
          <p class="admin-teachers-list__item-name">{{ teacher.name }}</p>
          <p class="admin-teachers-list__item-specialty">{{ teacher.specialty }}</p>
        </div>

        <div class="admin-teachers-list__item-actions">
          <button
            type="button"
            class="admin-teachers-list__edit"
            @click="handleEditClick(teacher)"
          >
            Editar
          </button>

          <button
            type="button"
            class="admin-teachers-list__delete"
            @click="handleDeleteClick(teacher)"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  teachers: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['delete', 'edit'])

// Pide confirmacion antes de avisar al componente padre, para evitar que
// un clic accidental borre un profesor sin darse cuenta
function handleDeleteClick(teacher) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar a "${teacher.name}"? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete', teacher.id)
  }
}

// Avisa al componente padre de que se quiere editar este profesor; no
// hace falta confirmacion porque no es una accion destructiva: solo abre
// el formulario precargado
function handleEditClick(teacher) {
  emit('edit', teacher)
}
</script>

<style lang="scss">
.admin-teachers-list {
  margin-top: 8rem;

  &__title {
    margin: 0 0 3rem;
    font-family: $font-doodle;
    font-size: 3.5rem;
    color: $color-error;
  }

  &__message {
    color: $color-text-dark;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }

  &__items {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin: 0;

    @include respond-to(desktop) {
      grid-template-columns: repeat(auto-fit, minmax(30rem, 35rem));
      gap: 3.5rem;
      margin-left: 10rem;
      margin-right: 4rem;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1.75rem 2.25rem;
    background-color: $color-background-soft;
    @include doodle-frame;
  }

  &__item-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__item-name {
    margin: 0;
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__item-specialty {
    margin: 0;
    font-size: 0.95rem;
    font-family: cursive;
    color: $color-text-dark;
  }

  &__item-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__edit {
    flex-shrink: 0;
    padding: 0.4rem 1rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-primary;
      color: $color-background;
    }
  }

  &__delete {
    flex-shrink: 0;
    padding: 0.4rem 1rem;
    border: 2px solid $color-error;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-error;
    font-family: $font-heading;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover,
    &:focus-visible {
      background-color: $color-error;
      color: $color-background;
    }
  }
}
</style>
