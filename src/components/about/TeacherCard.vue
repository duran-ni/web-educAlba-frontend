<template>
  <article class="teacher-card">
    <span class="teacher-card__tape" aria-hidden="true"></span>

    <div class="teacher-card__photo-frame">
      <img
        v-if="teacher.photoUrl"
        :src="teacher.photoUrl"
        :alt="`Foto de ${teacher.name}`"
        class="teacher-card__photo"
      />
      <div v-else class="teacher-card__avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      </div>
    </div>

    <h3 class="teacher-card__name">{{ teacher.name }}</h3>
    <p class="teacher-card__specialty">{{ teacher.specialty }}</p>
  </article>
</template>

<script setup>
// Tarjeta de un único profesor: recibe sus datos ya cargados por el
// componente padre (TeachersSection) y solo se encarga de mostrarlos
defineProps({
  teacher: {
    type: Object,
    required: true,
  },
})
</script>

<style lang="scss">
.teacher-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 0.75rem 0.75rem 1.5rem;
  background-color: $color-background;
  border: 2px solid $color-text-dark;
  box-shadow: 6px 6px 0 0 $color-text-dark;
  transition: transform 0.2s ease;

  // Cada tarjeta nace con una ligera rotacion distinta, igual que en el
  // prototipo, para que el conjunto parezca fotos pegadas a mano en un
  // tablon, no una fila de tarjetas perfectamente alineadas
  &:nth-child(3n+1) {
    transform: rotate(2deg);
  }

  &:nth-child(3n+2) {
    transform: rotate(-1deg);
  }

  &:nth-child(3n+3) {
    transform: rotate(1deg);
  }

  // Al pasar el raton, la foto se "endereza", como si la cogieras del tablon
  &:hover {
    transform: rotate(0deg);
  }

  &__tape {
    position: absolute;
    top: -0.9375rem;
    left: 50%;
    width: 5rem;
    height: 1.5625rem;
    transform: translateX(-50%) rotate(-2deg);
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(2px);
  }

  &__photo-frame {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 1px solid $color-background-soft;
    background-color: $color-background-alt;
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $color-text-dark;

    svg {
      width: 45%;
      height: 45%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &__name {
    margin: 0.5rem 0 0;
    font-family: $font-heading;
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__specialty {
    margin: 0;
    font-family: $font-doodle;
    font-style: italic;
    font-size: 1.0625rem;
    color: $color-text-dark;
  }
}
</style>
