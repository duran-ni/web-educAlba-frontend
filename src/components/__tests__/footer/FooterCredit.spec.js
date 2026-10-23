import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FooterCredit from '../../footer/FooterCredit.vue'

describe('FooterCredit.vue', () => {
  it('credits duran-ni as the designer and developer', () => {
    const wrapper = mount(FooterCredit)
    expect(wrapper.text()).toContain('Diseñado y desarrollado por')
    expect(wrapper.text()).toContain('duran-ni')
  })

  it('links to the GitHub profile, opening in a new tab safely', () => {
    const wrapper = mount(FooterCredit)
    const link = wrapper.get('.footer-credit__link')

    expect(link.attributes('href')).toBe('https://github.com/duran-ni')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('shows the GitHub icon', () => {
    const wrapper = mount(FooterCredit)
    expect(wrapper.find('.footer-credit__icon').exists()).toBe(true)
  })
})
