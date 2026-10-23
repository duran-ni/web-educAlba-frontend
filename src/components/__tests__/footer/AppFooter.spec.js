import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import AppFooter from '../../footer/AppFooter.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/politica-privacidad', name: 'privacy-policy', component: { template: '<div />' } },
  ],
})

function mountFooter(props = {}) {
  return mount(AppFooter, { props, global: { plugins: [router] } })
}

describe('AppFooter.vue', () => {
  it('renders the logo, contact info and social links in the full variant', () => {
    const wrapper = mountFooter()
    expect(wrapper.find('.app-logo').exists()).toBe(true)
    expect(wrapper.find('.footer-contact').exists()).toBe(true)
    expect(wrapper.find('.footer-social').exists()).toBe(true)
  })

  it('shows only the copyright text in the reduced variant', () => {
    const wrapper = mountFooter({ variant: 'reduced' })
    expect(wrapper.find('.app-logo').exists()).toBe(false)
    expect(wrapper.find('.footer-contact').exists()).toBe(false)
    expect(wrapper.find('.footer-social').exists()).toBe(false)
    expect(wrapper.find('.footer-legal').exists()).toBe(true)
  })

  it('shows the privacy policy link by default, in both variants', () => {
    expect(mountFooter({ variant: 'full' }).find('.footer-legal__link').exists()).toBe(true)
    expect(mountFooter({ variant: 'reduced' }).find('.footer-legal__link').exists()).toBe(true)
  })

  it('hides the privacy policy link when showPrivacyLink is false', () => {
    expect(
      mountFooter({ variant: 'full', showPrivacyLink: false }).find('.footer-legal__link').exists()
    ).toBe(false)
    expect(
      mountFooter({ variant: 'reduced', showPrivacyLink: false }).find('.footer-legal__link')
        .exists()
    ).toBe(false)
  })
})
