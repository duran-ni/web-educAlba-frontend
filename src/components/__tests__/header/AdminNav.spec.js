import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import AdminNav from '../../header/AdminNav.vue'
import { logout } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  logout: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/admin', name: 'admin', component: { template: '<div />' } },
    { path: '/talleres', name: 'workshops', component: { template: '<div />' } },
    { path: '/refuerzo', name: 'reinforcement', component: { template: '<div />' } },
    { path: '/admin/alumnos', name: 'students', component: { template: '<div />' } },
  ],
})

describe('AdminNav.vue', () => {
  beforeEach(() => {
    router.push('/')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the 6 admin navigation links', async () => {
    await router.isReady()
    const wrapper = mount(AdminNav, { global: { plugins: [router, createPinia()] } })
    const links = wrapper.findAll('.admin-nav__link')
    expect(links).toHaveLength(6)
    expect(links.map((link) => link.text())).toEqual([
      'Inicio',
      'Dashboard',
      'Refuerzo',
      'Talleres',
      'Alumnos',
      'Salir',
    ])
  })

  it('marks the link matching the current route as active', async () => {
    await router.push({ name: 'admin' })
    await router.isReady()
    const wrapper = mount(AdminNav, { global: { plugins: [router, createPinia()] } })
    const activeLinks = wrapper.findAll('.admin-nav__link--active')
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0].text()).toBe('Dashboard')
  })

  it('logs out and redirects to the public home page when "Salir" is clicked', async () => {
    logout.mockResolvedValueOnce({})
    await router.push({ name: 'admin' })
    await router.isReady()
    const wrapper = mount(AdminNav, { global: { plugins: [router, createPinia()] } })

    await wrapper.get('.admin-nav__logout').trigger('click')
    await flushPromises()

    expect(logout).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('home')
  })
})
