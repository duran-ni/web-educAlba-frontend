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

describe('Header/footer variant on the login route', () => {
  afterEach(async () => {
    await router.push('/')
  })

  it('shows the reduced header and footer on /login', async () => {
    await router.push({ name: 'login' })
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.find('.nav-menu').exists()).toBe(false)
    expect(wrapper.find('.footer-contact').exists()).toBe(false)
  })

  it('shows the full header and footer on public views', async () => {
    await router.push({ name: 'home' })
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.find('.nav-menu').exists()).toBe(true)
    expect(wrapper.find('.footer-contact').exists()).toBe(true)
  })
})
