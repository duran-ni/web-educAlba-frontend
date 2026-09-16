import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import NavMenu from '../NavMenu.vue'

// Router mínimo de prueba, con las mismas 6 rutas públicas que usa el menú real
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/talleres', name: 'workshops', component: { template: '<div />' } },
    { path: '/refuerzo', name: 'reinforcement', component: { template: '<div />' } },
    { path: '/quienes-somos', name: 'about', component: { template: '<div />' } },
    { path: '/que-hacemos', name: 'what-we-do', component: { template: '<div />' } },
    { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
  ],
})

describe('NavMenu.vue', () => {
  beforeEach(() => {
    router.push('/')
  })

  it('renders the 6 main navigation links', async () => {
    await router.isReady()
    const wrapper = mount(NavMenu, {
      global: { plugins: [router] },
    })

    const links = wrapper.findAll('.nav-menu__link')
    expect(links).toHaveLength(6)

    const labels = links.map((link) => link.text())
    expect(labels).toEqual([
      'Inicio',
      'Talleres',
      'Refuerzo',
      'Quiénes Somos',
      'Qué Hacemos',
      'Galería',
    ])
  })
})
