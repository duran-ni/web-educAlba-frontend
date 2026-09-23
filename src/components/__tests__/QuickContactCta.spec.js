import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import QuickContactCta from '../QuickContactCta.vue'

describe('QuickContactCta.vue', () => {
  it('renders the CTA heading', () => {
    const wrapper = mount(QuickContactCta)
    expect(wrapper.find('.quick-contact-cta__heading').text()).toBe('¡Aclara tus dudas!')
  })

  it('renders a tel link and a mailto link', () => {
    const wrapper = mount(QuickContactCta)
    expect(wrapper.find('a[href^="tel:"]').exists()).toBe(true)
    expect(wrapper.find('a[href^="mailto:"]').exists()).toBe(true)
  })
})
