<template>
  <header class="app-header" :class="{ 'app-header--reduced': variant === 'reduced' }">
    <RouterLink :to="{ name: 'home' }" class="app-header__logo-link">
      <AppLogo />
    </RouterLink>

    <template v-if="variant === 'full'">
      <NavMenu :is-open="isMenuOpen" @navigate="closeMenu" />

      <div class="app-header__actions">
        <DashboardButton v-if="authStore.isAuthenticated" />
        <template v-else>
          <RegisterButton />
          <LoginButton />
        </template>
        <NavToggle :is-open="isMenuOpen" @toggle="toggleMenu" />
      </div>
    </template>

    <template v-else-if="variant === 'admin'">
      <AdminNav />
    </template>
    <template v-else-if="variant === 'user'">
      <div class="app-header__actions">
        <UserNav :is-open="isMenuOpen" @navigate="closeMenu" />
        <NavToggle :is-open="isMenuOpen" controls="user-nav-list" @toggle="toggleMenu" />
      </div>
    </template>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLogo from '../AppLogo.vue'
import NavMenu from './NavMenu.vue'
import LoginButton from './LoginButton.vue'
import RegisterButton from './RegisterButton.vue'
import DashboardButton from './DashboardButton.vue'
import NavToggle from './NavToggle.vue'
import AdminNav from './AdminNav.vue'
import UserNav from './UserNav.vue'

defineProps({
  variant: {
    type: String,
    default: 'full',
  },
})

const isMenuOpen = ref(false)

const authStore = useAuthStore()

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<style lang="scss">
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: $color-background;
  border-bottom: 2px dashed $color-primary;

  &--reduced {
    justify-content: center;
  }

  &__logo-link {
    display: inline-flex;
    text-decoration: none;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>
