<template>
  <section class="workshops-calendar">
    <h2 class="workshops-calendar__heading">{{ monthLabel }}</h2>

    <div class="workshops-calendar__grid workshops-calendar__grid--weekdays">
      <span v-for="weekday in WEEKDAY_LABELS" :key="weekday" class="workshops-calendar__weekday">
        {{ weekday }}
      </span>
    </div>

    <div class="workshops-calendar__grid">
      <span
        v-for="blank in leadingBlanks"
        :key="`blank-${blank}`"
        class="workshops-calendar__day workshops-calendar__day--empty"
      ></span>

      <button
        v-for="day in daysInMonth"
        :key="day"
        type="button"
        class="workshops-calendar__day"
        :class="{ 'workshops-calendar__day--marked': workshopsByDay[day] }"
        :aria-label="dayAriaLabel(day)"
        @mouseenter="hoveredDay = day"
        @mouseleave="hoveredDay = null"
        @click="selectedDay = selectedDay === day ? null : day"
      >
        {{ day }}
      </button>
    </div>

    <div v-if="activeDayWorkshops.length > 0" class="workshops-calendar__detail">
      <article
        v-for="workshop in activeDayWorkshops"
        :key="workshop.id"
        class="workshops-calendar__detail-item"
      >
        <p class="workshops-calendar__detail-name">{{ workshop.name }}</p>
        <p class="workshops-calendar__detail-description">{{ workshop.description }}</p>
      </article>
    </div>

    <p v-else class="workshops-calendar__hint">
      Pulsa o pasa el cursor sobre un día marcado para ver el taller.
    </p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchWorkshops } from '@/services/workshops'

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const today = new Date()
const year = today.getFullYear()
const month = today.getMonth()

// Nombre del mes en curso en español, con la primera letra en mayúscula
// ("octubre" -> "Octubre 2026"). Se formatea el mes y el año por separado,
// en vez de usar el formato combinado de Intl, para no arrastrar el "de"
// que añade por defecto (p.ej. "octubre de 2026").
const monthLabel = computed(() => {
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(today)
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
  return `${capitalizedMonthName} ${year}`
})

// Número de días que tiene el mes en curso (día 0 del mes siguiente = último día de este mes)
const daysInMonth = computed(() => new Date(year, month + 1, 0).getDate())

// Día de la semana del día 1 del mes, convertido para que la semana empiece en lunes
// (Date.getDay() devuelve domingo = 0, lunes = 1... aquí lo reindexamos a lunes = 0)
const leadingBlanks = computed(() => {
  const firstWeekday = new Date(year, month, 1).getDay()
  return (firstWeekday + 6) % 7
})

const workshops = ref([])

onMounted(async () => {
  try {
    const response = await fetchWorkshops()
    workshops.value = response.data
  } catch {
    workshops.value = []
  }
})

// Agrupa los talleres del mes en curso por día del mes,
// ya que puede haber más de un taller el mismo día
const workshopsByDay = computed(() => {
  const map = {}

  workshops.value.forEach((workshop) => {
    const [workshopYear, workshopMonth, workshopDay] = workshop.date.split('-').map(Number)

    if (workshopYear === year && workshopMonth - 1 === month) {
      if (!map[workshopDay]) {
        map[workshopDay] = []
      }
      map[workshopDay].push(workshop)
    }
  })

  return map
})

const hoveredDay = ref(null)
const selectedDay = ref(null)

// El día activo es el que está bajo el cursor; si no hay ninguno, el último pulsado
const activeDay = computed(() => hoveredDay.value ?? selectedDay.value)
const activeDayWorkshops = computed(() => (activeDay.value ? (workshopsByDay.value[activeDay.value] ?? []) : []))

function dayAriaLabel(day) {
  const dayWorkshops = workshopsByDay.value[day]
  return dayWorkshops
    ? `Día ${day}, con taller: ${dayWorkshops.map((workshop) => workshop.name).join(', ')}`
    : `Día ${day}, sin talleres`
}
</script>

<style lang="scss">
.workshops-calendar {
  max-width: 56rem;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: $color-background-alt;
  @include doodle-frame;

  &__heading {
    margin: 0 0 1rem;
    font-family: $font-doodle;
    font-size: 1.5rem;
    color: $color-primary;
    text-align: center;
    text-transform: capitalize;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    text-align: center;
  }

  &__grid--weekdays {
    margin-bottom: 0.5rem;
  }

  &__weekday {
    font-family: $font-heading;
    font-size: 0.75rem;
    font-weight: 600;
    color: $color-text-dark;
  }

  &__day {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: transparent;
    font-family: $font-body;
    font-size: 0.875rem;
    color: $color-text-dark;
    cursor: default;

    &--marked {
      background-color: $color-accent-pink-medium;
      color: $color-background;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease;

      &:hover,
      &:focus-visible {
        transform: scale(1.1);
        outline: none;
      }
    }
  }

  &__detail {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 2px dashed $color-text-dark;
  }

  &__detail-name {
    margin: 0;
    font-family: $font-heading;
    font-weight: 600;
    color: $color-primary;
  }

  &__detail-description {
    margin: 0.25rem 0 0;
    color: $color-text-dark;
  }

  &__hint {
    margin: 1.5rem 0 0;
    text-align: center;
    font-size: 0.875rem;
    color: $color-text-dark;
    opacity: 0.7;
  }
}
</style>
