<template>
  <button
    type="button"
    class="nav-toggle"
    :class="{ 'nav-toggle--active': isOpen }"
    :aria-expanded="isOpen"
    :aria-controls="controls"
    @click="$emit('toggle')"
  >
    <span class="nav-toggle__bar"></span>
    <span class="nav-toggle__bar"></span>
    <span class="nav-toggle__bar"></span>
    <span class="nav-toggle__label">{{ isOpen ? 'Cerrar menú' : 'Abrir menú' }}</span>
  </button>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  // Id del elemento que este botón controla mediante aria-controls.
  // Por defecto apunta al menú público ("main-nav"); UserNav lo sobrescribe con "user-nav-list"
  controls: {
    type: String,
    default: 'main-nav',
  },
})

defineEmits(['toggle'])
</script>

<style lang="scss">
.nav-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  @include respond-to(tablet) {
    display: none;
  }

  &__bar {
    display: block;
    width: 24px;
    height: 2px;
    background-color: $color-text-dark;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  &__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &--active .nav-toggle__bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  &--active .nav-toggle__bar:nth-child(2) {
    opacity: 0;
  }

  &--active .nav-toggle__bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}
</style>
