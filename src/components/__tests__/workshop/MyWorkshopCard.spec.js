import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyWorkshopCard from '../../workshop/MyWorkshopCard.vue'

describe('MyWorkshopCard.vue', () => {
  const enrollment = {
    enrollmentId: 2,
    workshopId: 5,
    workshopName: 'Robótica',
    date: '2026-11-10',
    time: '17:00:00',
    progress: 'iniciado',
  }

  it('shows the workshop name, date, time and progress', () => {
    const wrapper = mount(MyWorkshopCard, { props: { enrollment } })

    expect(wrapper.text()).toContain('Robótica')
    expect(wrapper.text()).toContain('martes, 10 de noviembre')
    expect(wrapper.text()).toContain('17:00 h')
    expect(wrapper.text()).toContain('iniciado')
  })
})
