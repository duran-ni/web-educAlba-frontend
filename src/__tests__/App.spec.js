import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import App from '../App.vue'
import router from '../router'

// Cada caso es una ruta destino y el texto que debe aparecer una vez cargada esa vista
const NAVIGATION_CASES = [
  { name: 'home', heading: 'Inicio' },
  { name: 'workshops', heading: 'Talleres' },
  { name: 'reinforcement', heading: 'Refuerzo' },
  { name: 'about', heading: 'Quiénes Somos' },
  { name: 'what-we-do', heading: 'Qué Hacemos' },
  { name: 'gallery', heading: 'Galería' },
]

describe('Public navigation', () => {
  afterEach(async () => {
    await router.push('/')
  })

  it.each(NAVIGATION_CASES)('navigating to $name shows the $heading view', async ({ name, heading }) => {
    await router.push({ name })
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })

    expect(wrapper.find('main').text()).toContain(heading)
  })
})
