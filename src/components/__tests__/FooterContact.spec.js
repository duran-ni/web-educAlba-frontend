import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FooterContact from '../FooterContact.vue'

describe('FooterContact.vue', () => {
  it('renders a mailto link for the contact email', () => {
    const wrapper = mount(FooterContact)
    expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(true)
  })

  it('renders a tel link for the contact phone', () => {
    const wrapper = mount(FooterContact)
    expect(wrapper.find('a[href^="tel:"]').exists()).toBe(true)
  })

  it('renders an icon for each contact item', () => {
    const wrapper = mount(FooterContact)
    expect(wrapper.findAll('.footer-contact__icon')).toHaveLength(3)
  })
})
