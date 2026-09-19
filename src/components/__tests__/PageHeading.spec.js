import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import PageHeading from '../PageHeading.vue'

describe('PageHeading.vue', () => {
  it('renders the title as an H1', () => {
    const wrapper = mount(PageHeading, { props: { title: 'Talleres' } })
    expect(wrapper.find('h1').text()).toBe('Talleres')
  })

  it('does not render a subtitle when none is provided', () => {
    const wrapper = mount(PageHeading, { props: { title: 'Talleres' } })
    expect(wrapper.find('.page-heading__subtitle').exists()).toBe(false)
  })

  it('renders the subtitle when provided', () => {
    const wrapper = mount(PageHeading, {
      props: { title: 'Talleres', subtitle: 'Actividades para peques' },
    })
    expect(wrapper.find('.page-heading__subtitle').text()).toBe('Actividades para peques')
  })
})
