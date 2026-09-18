import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FooterSocial from '../FooterSocial.vue'

describe('FooterSocial.vue', () => {
  it('renders a link for each social network', () => {
    const wrapper = mount(FooterSocial)
    expect(wrapper.findAll('.footer-social__link').length).toBeGreaterThan(0)
  })

  it('opens social links safely in a new tab', () => {
    const wrapper = mount(FooterSocial)
    wrapper.findAll('.footer-social__link').forEach((link) => {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })
  })
})
