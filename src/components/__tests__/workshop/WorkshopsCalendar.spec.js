import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import WorkshopsCalendar from '../WorkshopsCalendar.vue'
import { fetchWorkshops } from '@/services/workshops'

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

// Fecha fija para que el test no dependa del día real en que se ejecute:
// 1 de octubre de 2026 es un jueves, así que el mes tiene 3 huecos antes del día 1
// (lunes, martes y miércoles) y 31 días en total.
const FIXED_TODAY = new Date(2026, 9, 1, 12, 0, 0)

function findDayButton(wrapper, day) {
  return wrapper.findAll('button').find((button) => button.text() === String(day))
}

describe('WorkshopsCalendar.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_TODAY)
    fetchWorkshops.mockResolvedValue({ status: 200, data: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('shows the current month and year, with the correct number of days', async () => {
    const wrapper = mount(WorkshopsCalendar)
    await flushPromises()

    expect(wrapper.find('.workshops-calendar__heading').text()).toBe('Octubre 2026')
    expect(wrapper.findAll('button')).toHaveLength(31)
    expect(wrapper.findAll('.workshops-calendar__day--empty')).toHaveLength(3)
  })

  it('marks only the days that have an active workshop', async () => {
    fetchWorkshops.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Manos a la obra',
          description: 'Un taller sensorial.',
          date: '2026-10-24',
          time: '11:00:00',
          recommendedAge: '1-2 años',
          room: null,
          active: true,
        },
      ],
    })

    const wrapper = mount(WorkshopsCalendar)
    await flushPromises()

    expect(findDayButton(wrapper, 24).classes()).toContain('workshops-calendar__day--marked')
    expect(findDayButton(wrapper, 10).classes()).not.toContain('workshops-calendar__day--marked')
  })

  it('shows the workshop detail (including its time) on hover, and hides it again when the cursor leaves', async () => {
    fetchWorkshops.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Manos a la obra',
          description: 'Un taller sensorial.',
          date: '2026-10-24',
          time: '11:00:00',
          recommendedAge: '1-2 años',
          room: null,
          active: true,
        },
      ],
    })

    const wrapper = mount(WorkshopsCalendar)
    await flushPromises()

    const day24 = findDayButton(wrapper, 24)

    await day24.trigger('mouseenter')
    expect(wrapper.text()).toContain('Manos a la obra')
    expect(wrapper.text()).toContain('11:00 h')

    await day24.trigger('mouseleave')
    expect(wrapper.text()).not.toContain('Manos a la obra')
  })

  it('keeps the workshop detail visible after a click, even once the cursor leaves', async () => {
    fetchWorkshops.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Manos a la obra',
          description: 'Un taller sensorial.',
          date: '2026-10-24',
          time: '11:00:00',
          recommendedAge: '1-2 años',
          room: null,
          active: true,
        },
      ],
    })

    const wrapper = mount(WorkshopsCalendar)
    await flushPromises()

    const day24 = findDayButton(wrapper, 24)

    await day24.trigger('click')
    await day24.trigger('mouseleave')

    expect(wrapper.text()).toContain('Manos a la obra')
  })
})
