<template>
  <nav class="user-nav" aria-label="Navegación del área privada">
    <ul id="user-nav-list" class="user-nav__list" :class="{ 'user-nav__list--open': isOpen }">
      <li v-for="link in links" :key="link.to.name" class="user-nav__item">
        <RouterLink
          :to="link.to"
          class="user-nav__link"
          active-class="user-nav__link--active"
          @click="$emit('navigate')"
        >
          {{ link.label }}
        </RouterLink>
      </li>
      <li class="user-nav__item">
        <button type="button" class="user-nav__link user-nav__logout" @click="handleLogout">
          Salir
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['navigate'])

const router = useRouter()
const authStore = useAuthStore()

// Unica opcion del area privada del alumno/familia: todo vive ya en "Mi
// Panel" (saludo + talleres inscritos), no hay vistas separadas que enlazar
const links = [
  { label: 'Mi Panel', to: { name: 'dashboard' } },
]

// Cierra la sesion del alumno/familia, cierra el menu movil y vuelve a Inicio
async function handleLogout() {
  emit('navigate')
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<style lang="scss">
.user-nav {
  &__list {
    display: none;
    flex-direction: column;
    list-style: none;
    gap: 1rem;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 1rem 1.5rem;
    background-color: $color-background;

    &--open {
      display: flex;
    }

    @include respond-to(tablet) {
      display: flex;
      flex-direction: row;
      position: static;
      gap: 1.5rem;
      padding: 0;
      background-color: transparent;
    }
  }

  &__link {
    text-decoration: none;
    color: inherit;

    &--active {
      font-weight: 600;
      color: $color-primary;
    }
  }

  &__logout {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
}
</style>
