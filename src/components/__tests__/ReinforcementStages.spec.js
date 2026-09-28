import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ReinforcementStages from '../ReinforcementStages.vue'

describe('ReinforcementStages.vue', () => {
  it('shows the three educational stages with their age/grade badge', () => {
    const wrapper = mount(ReinforcementStages)

    expect(wrapper.findAll('.reinforcement-stages__card')).toHaveLength(3)
    expect(wrapper.text()).toContain('Infantil')
    expect(wrapper.text()).toContain('3 a 6 años')
    expect(wrapper.text()).toContain('Primaria')
    expect(wrapper.text()).toContain('1º a 6º Primaria')
    expect(wrapper.text()).toContain('E.S.O.')
    expect(wrapper.text()).toContain('1º a 4º E.S.O.')
  })

  it('lists every subject for each stage', () => {
    const wrapper = mount(ReinforcementStages)

    expect(wrapper.text()).toContain('Lógico-matemático')
    expect(wrapper.text()).toContain('Cálculo')
    expect(wrapper.text()).toContain('Hábitos de estudio')
    expect(wrapper.text()).toContain('Acompañamiento con los deberes')
    expect(wrapper.text()).toContain('Física')
    expect(wrapper.text()).toContain('Química')
    expect(wrapper.text()).toContain('Preparación de exámenes')
  })
})
