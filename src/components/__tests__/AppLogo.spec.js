import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AppLogo from '../AppLogo.vue'

// Grupo de pruebas para el componente AppLogo
describe('AppLogo.vue', () => {
  it('renders the message prop correctly', () => {
    const wrapper = mount(AppLogo, {
      props: { message: 'Hello Vitest' },
    })

    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
