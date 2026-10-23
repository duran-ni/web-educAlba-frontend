import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import FooterLegal from '../../footer/FooterLegal.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/politica-privacidad', name: 'privacy-policy', component: { template: '<div />' } },
  ],
})

function mountLegal(props = {}) {
  return mount(FooterLegal, { props, global: { plugins: [router] } })
}

describe('FooterLegal.vue', () => {
  it('shows the current year in the copyright text', () => {
    const wrapper = mountLegal()
    expect(wrapper.text()).toContain(new Date().getFullYear().toString())
  })

  it('mentions EducAlba and the rights-reserved notice in the copyright text', () => {
    const wrapper = mountLegal()
    expect(wrapper.text()).toContain('EducAlba. Todos los derechos reservados.')
  })

  it('links "Política de Privacidad" to the privacy policy page by default', () => {
    const wrapper = mountLegal()
    const link = wrapper.get('.footer-legal__link')
    expect(link.text()).toBe('Política de Privacidad')
    expect(link.attributes('href')).toBe('/politica-privacidad')
  })

  it('hides the privacy policy link when showPrivacyLink is false', () => {
    const wrapper = mountLegal({ showPrivacyLink: false })
    expect(wrapper.find('.footer-legal__link').exists()).toBe(false)
    expect(wrapper.text()).toContain('Todos los derechos reservados.')
  })
})
