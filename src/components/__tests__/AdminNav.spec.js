import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import AdminNav from '../AdminNav.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/talleres', name: 'workshops', component: { template: '<div />' } },
    { path: '/refuerzo', name: 'reinforcement', component: { template: '<div />' } },
    { path: '/admin/gestion', name: 'management', component: { template: '<div />' } },
  ],
})

describe('AdminNav.vue', () => {
  beforeEach(() => {
    router.push('/')
  })

  it('renders the 4 admin navigation links', async () => {
    await router.isReady()
    const wrapper = mount(AdminNav, { global: { plugins: [router] } })
    const links = wrapper.findAll('.admin-nav__link')
    expect(links).toHaveLength(4)
    expect(links.map((link) => link.text())).toEqual(['Inicio', 'Talleres', 'Refuerzo', 'Gestión'])
  })

  it('marks the link matching the current route as active', async () => {
    await router.push({ name: 'management' })
    await router.isReady()
    const wrapper = mount(AdminNav, { global: { plugins: [router] } })
    const activeLinks = wrapper.findAll('.admin-nav__link--active')
    expect(activeLinks).toHaveLength(1)
    expect(activeLinks[0].text()).toBe('Gestión')
  })
})
