import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import NavToggle from '../NavToggle.vue'

describe('NavToggle.vue', () => {
  it('emits "toggle" when clicked', async () => {
    const wrapper = mount(NavToggle)
    await wrapper.trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('reflects the open state via aria-expanded', () => {
    const closed = mount(NavToggle, { props: { isOpen: false } })
    expect(closed.attributes('aria-expanded')).toBe('false')

    const open = mount(NavToggle, { props: { isOpen: true } })
    expect(open.attributes('aria-expanded')).toBe('true')
  })

  it('links to the navigable menu region via aria-controls', () => {
    const wrapper = mount(NavToggle)
    expect(wrapper.attributes('aria-controls')).toBe('main-nav')
  })
})
