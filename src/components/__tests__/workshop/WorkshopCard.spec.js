import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import WorkshopCard from '../WorkshopCard.vue'

describe('WorkshopCard.vue', () => {
  const workshop = {
    id: 1,
    name: 'Manos a la obra',
    description: 'Un taller sensorial pensado para los más pequeños.',
    date: '2026-10-24',
    time: '11:00:00',
    recommendedAge: '1-2 años',
    room: null,
    active: true,
  }

  it('shows the workshop name, description, date, time and recommended age', () => {
    const wrapper = mount(WorkshopCard, { props: { workshop } })

    expect(wrapper.text()).toContain('Manos a la obra')
    expect(wrapper.text()).toContain('Un taller sensorial pensado para los más pequeños.')
    expect(wrapper.text()).toContain('sábado, 24 de octubre')
    expect(wrapper.text()).toContain('11:00 h')
    expect(wrapper.text()).toContain('1-2 años')
  })
})
