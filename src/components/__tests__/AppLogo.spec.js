import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AppLogo from '../AppLogo.vue'

// Grupo de pruebas para el componente AppLogo
describe('AppLogo.vue', () => {
  it('renders the logo image', () => {
    const wrapper = mount(AppLogo)

    expect(wrapper.find('img.app-logo').exists()).toBe(true)
  })

 it('has an accessible alt text describing the logo', () => {
    const wrapper = mount(AppLogo)

    expect(wrapper.find('img.app-logo').attributes('alt')).toBe('Logo de EducAlba')
  })
})
