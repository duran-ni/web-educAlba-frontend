import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import DashboardButton from '../../header/DashboardButton.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
    { path: '/admin', name: 'admin', component: { template: '<div />' } },
  ],
})

function mountButton() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return {
    wrapper: mount(DashboardButton, { global: { plugins: [router, pinia] } }),
    store: useAuthStore(),
  }
}

describe('DashboardButton.vue', () => {
  beforeEach(async () => {
    await router.push('/')
  })

  it('links to the user dashboard and shows "Mi Perfil" for a family user', async () => {
    const { wrapper, store } = mountButton()
    store.user = { email: 'familia@educalba.com', roles: ['ALUMNO_FAMILIA'] }
    await nextTick()

    expect(wrapper.text()).toBe('Mi Perfil')
    expect(wrapper.get('a').attributes('href')).toBe('/dashboard')
  })

  it('links to the admin panel and shows "Dashboard Admin" for an administrator', async () => {
    const { wrapper, store } = mountButton()
    store.user = { email: 'admin@educalba.com', roles: ['ADMINISTRADOR'] }
    await nextTick()

    expect(wrapper.text()).toBe('Dashboard Admin')
    expect(wrapper.get('a').attributes('href')).toBe('/admin')
  })

  it('treats a user with no roles at all as a non-admin', async () => {
    const { wrapper, store } = mountButton()
    store.user = { email: 'familia@educalba.com' }
    await nextTick()

    expect(wrapper.text()).toBe('Mi Perfil')
  })
})
