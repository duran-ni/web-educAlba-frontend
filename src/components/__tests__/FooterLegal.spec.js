import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FooterLegal from '../FooterLegal.vue'

describe('FooterLegal.vue', () => {
  it('shows the current year in the copyright text', () => {
    const wrapper = mount(FooterLegal)
    expect(wrapper.text()).toContain(new Date().getFullYear().toString())
  })

  it('mentions EducAlba in the copyright text', () => {
    const wrapper = mount(FooterLegal)
    expect(wrapper.text()).toContain('EducAlba')
  })
})
