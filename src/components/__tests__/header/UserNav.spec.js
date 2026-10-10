import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import UserNav from '../../header/UserNav.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
    { path: '/dashboard/mis-talleres', name: 'my-workshops', component: { template: '<div />' } },
    { path: '/dashboard/mi-perfil', name: 'my-profile', component: { template: '<div />' } },
  ],
})

describe('UserNav.vue', () => {
  beforeEach(() => {
    router.push('/dashboard')
  })

  it('renders the 4 private area links', async () => {
    await router.isReady()
    const wrapper = mount(UserNav, { global: { plugins: [router, createPinia()] } })
    const links = wrapper.findAll('.user-nav__link')
    expect(links).toHaveLength(4)
    expect(links.map((link) => link.text())).toEqual(['Inicio', 'Mis Talleres', 'Mi Perfil', 'Salir'])
  })

  it('applies the open modifier class when isOpen is true', async () => {
    await router.isReady()
    const wrapper = mount(UserNav, { props: { isOpen: true }, global: { plugins: [router, createPinia()] } })
    expect(wrapper.find('.user-nav__list').classes()).toContain('user-nav__list--open')
  })

  it('emits "navigate" when a link is clicked', async () => {
    await router.isReady()
    const wrapper = mount(UserNav, { global: { plugins: [router, createPinia()] } })
    await wrapper.get('.user-nav__link').trigger('click')
    expect(wrapper.emitted('navigate')).toHaveLength(1)
  })
})
