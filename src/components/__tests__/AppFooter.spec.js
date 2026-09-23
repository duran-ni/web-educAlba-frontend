import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AppFooter from '../AppFooter.vue'

describe('AppFooter.vue', () => {
  it('renders the logo, contact info and social links in the full variant', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.find('.app-logo').exists()).toBe(true)
    expect(wrapper.find('.footer-contact').exists()).toBe(true)
    expect(wrapper.find('.footer-social').exists()).toBe(true)
  })

  it('shows only the copyright text in the reduced variant', () => {
    const wrapper = mount(AppFooter, { props: { variant: 'reduced' } })
    expect(wrapper.find('.app-logo').exists()).toBe(false)
    expect(wrapper.find('.footer-contact').exists()).toBe(false)
    expect(wrapper.find('.footer-social').exists()).toBe(false)
    expect(wrapper.find('.footer-legal').exists()).toBe(true)
  })
})
