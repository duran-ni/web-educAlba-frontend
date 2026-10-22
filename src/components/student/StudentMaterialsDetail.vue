<template>
  <section class="student-materials-detail">
    <button type="button" class="student-materials-detail__back" @click="$emit('back')">
      ← Volver a alumnos
    </button>

    <div class="student-materials-detail__header">
      <h2 class="student-materials-detail__title">
        Materiales de {{ student.firstName }} {{ student.lastName }}
      </h2>

      <button
        type="button"
        class="student-materials-detail__upload"
        @click="$emit('upload-material', student)"
      >
        Subir archivo
      </button>
    </div>

    <p v-if="materials.length === 0" class="student-materials-detail__empty">
      Todavía no se le ha subido ningún PDF a este alumno.
    </p>

    <ul v-else class="student-materials-detail__list">
      <li
        v-for="material in sortedMaterials"
        :key="material.id"
        class="student-materials-detail__item"
      >
        <div class="student-materials-detail__item-info">
          <div class="student-materials-detail__item-title-row">
            <a
              :href="material.downloadUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="student-materials-detail__item-link"
            >
              <span class="material-symbols-outlined" aria-hidden="true">picture_as_pdf</span>
              {{ material.title }}
            </a>

            <span class="student-materials-detail__item-separator" aria-hidden="true"></span>

            <span class="student-materials-detail__item-date">
              Subido el {{ formatDate(material.uploadedAt) }}
            </span>
          </div>

          <p v-if="material.description" class="student-materials-detail__item-description">
            {{ material.description }}
          </p>
        </div>

        <div class="student-materials-detail__item-actions">
          <button
            type="button"
            class="student-materials-detail__item-edit"
            :aria-label="`Editar ${material.title}`"
            @click="$emit('edit-material', material)"
          >
            Editar
          </button>

          <button
            type="button"
            class="student-materials-detail__item-delete"
            :aria-label="`Eliminar ${material.title}`"
            @click="handleDeleteClick(material)"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Alumno cuyos materiales se están gestionando (id, firstName, lastName)
  student: {
    type: Object,
    required: true,
  },
  // Materiales de este alumno, ya filtrados por el componente padre
  materials: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['back', 'upload-material', 'edit-material', 'delete-material'])

// Se muestran del más reciente al más antiguo, para que las últimas tareas
// mandadas aparezcan siempre arriba, sin que el administrador tenga que
// buscar entre materiales antiguos
const sortedMaterials = computed(() =>
  [...props.materials].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
)

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Pide confirmación antes de avisar al componente padre, para evitar que un
// clic accidental borre un material sin darse cuenta
function handleDeleteClick(material) {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar "${material.title}"? Esta acción no se puede deshacer.`
  )

  if (confirmed) {
    emit('delete-material', material.id)
  }
}
</script>

<style lang="scss">
.student-materials-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__back {
    align-self: flex-start;
    padding: 0.4rem 0;
    border: none;
    background: none;
    color: $color-text-dark;
    font-family: $font-heading;
    font-weight: 600;
    font-size: 1.3rem;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  // Misma fuente "doodle" que usan el resto de títulos del panel de admin
  // (por ejemplo, "Alumnos" y "Carpetas"), para que este título quede
  // coherente con el resto de la aplicación
  &__title {
    margin: 0;
    font-family: $font-doodle;
    font-size: 1.75rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__upload {
    padding: 0.55rem 1.3rem;
    border: 2px solid $color-primary;
    border-radius: 999px;
    background-color: $color-background;
    color: $color-primary;
    font-family: $font-heading;
    font-size: 0.95rem;
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

  &__empty {
    color: $color-text-dark;
  }

  // La lista pasa de ser una rejilla de tarjetas cuadradas a una columna de
  // filas que ocupan todo el ancho disponible, una debajo de otra
  &__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }

  // Cada fila coloca la información a la izquierda y las acciones a la
  // derecha; "flex-wrap: wrap" hace que, en pantallas estrechas, las
  // acciones bajen a su propia línea en vez de desbordar la fila
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem 1.25rem;
    background-color: $color-background-soft;
    border-radius: 0.75rem;
  }

  // Agrupa el título+fecha y la descripción en una columna propia, separada
  // de las acciones; "min-width: 0" evita que un título largo empuje a los
  // botones fuera de la fila en vez de ajustarse
  &__item-info {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  // Coloca el enlace al PDF y la fecha de subida en la misma línea; si no
  // caben (título largo o pantalla estrecha), la fecha pasa a su propia
  // línea gracias a "flex-wrap: wrap"
  &__item-title-row {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  &__item-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $color-primary;
    font-weight: 600;
    word-break: break-word;

    &:hover,
    &:focus-visible {
      text-decoration: underline;
    }
  }

  &__item-description {
    margin: 0;
    font-size: 0.875rem;
    color: $color-text-dark;
  }

  &__item-date {
    font-size: 0.75rem;
    color: $color-text-dark;
    opacity: 0.75;
    white-space: nowrap;
  }

  // "flex-shrink: 0" evita que los botones se compriman cuando el título o
  // la descripción ocupan mucho espacio en la misma fila
  &__item-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__item-edit,
  &__item-delete {
    align-self: flex-start;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  &__item-edit {
    border: 1px solid $color-green-dark;
    background: none;
    color: $color-green-dark;

    &:hover,
    &:focus-visible {
      background-color: $color-green-dark;
      color: $color-background;
    }
  }

  &__item-delete {
    border: 1px solid $color-error;
    background: none;
    color: $color-error;

    &:hover,
    &:focus-visible {
      background-color: $color-error;
      color: $color-background;
    }
  }
}
</style>
