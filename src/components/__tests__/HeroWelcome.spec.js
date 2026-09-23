import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HeroWelcome from '../HeroWelcome.vue'

describe('HeroWelcome.vue', () => {
  it('renders the welcome tagline', () => {
    const wrapper = mount(HeroWelcome)
    expect(wrapper.find('.hero-welcome__tagline').text()).toBe('Enseñar con paciencia, aprender con confianza')
  })

   it('renders the welcome image with descriptive alt text', () => {
    const wrapper = mount(HeroWelcome)
    const image = wrapper.find('.hero-welcome__image')
    expect(image.exists()).toBe(true)
    expect(image.attributes('alt')).not.toBe('')
  })
})
