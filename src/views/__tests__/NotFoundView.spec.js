import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NotFoundView from '../NotFoundView.vue'

describe('NotFoundView.vue', () => {
  it('shows the 404 message', () => {
    const wrapper = mount(NotFoundView)

    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Página no encontrada')
  })
})
