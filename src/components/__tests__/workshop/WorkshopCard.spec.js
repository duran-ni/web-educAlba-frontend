import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import WorkshopCard from '../../workshop/WorkshopCard.vue'
import { enrollInWorkshop } from '@/services/dashboard'

vi.mock('@/services/dashboard', () => ({
  enrollInWorkshop: vi.fn(),
}))

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
    price: 15,
  }

  it('shows the workshop name, description, date, time, recommended age and price', () => {
    const wrapper = mount(WorkshopCard, { props: { workshop } })

    expect(wrapper.text()).toContain('Manos a la obra')
    expect(wrapper.text()).toContain('Un taller sensorial pensado para los más pequeños.')
    expect(wrapper.text()).toContain('sábado, 24 de octubre')
    expect(wrapper.text()).toContain('11:00 h')
    expect(wrapper.text()).toContain('1-2 años')
    expect(wrapper.text()).toContain('15,00 €')
  })

  it('shows "Gratis" when the workshop price is zero', () => {
    const freeWorkshop = { ...workshop, price: 0 }
    const wrapper = mount(WorkshopCard, { props: { workshop: freeWorkshop } })

    expect(wrapper.text()).toContain('Gratis')
  })

  it('does not show the "Apuntarme" button when canEnroll is false', () => {
    const wrapper = mount(WorkshopCard, { props: { workshop, canEnroll: false } })

    expect(wrapper.find('.workshop-card__enroll-button').exists()).toBe(false)
  })

  it('shows the "Apuntarme" button when the logged in family user has not enrolled yet', () => {
    const wrapper = mount(WorkshopCard, {
      props: { workshop, canEnroll: true, enrolledWorkshopIds: [] },
    })

    expect(wrapper.find('.workshop-card__enroll-button').exists()).toBe(true)
  })

  it('shows a badge instead of the button when the student is already enrolled', () => {
    const wrapper = mount(WorkshopCard, {
      props: { workshop, canEnroll: true, enrolledWorkshopIds: [1] },
    })

    expect(wrapper.find('.workshop-card__enroll-button').exists()).toBe(false)
    expect(wrapper.text()).toContain('Ya estás apuntado/a')
  })

  it('enrolls the student and emits "enrolled" when the button is clicked', async () => {
    enrollInWorkshop.mockResolvedValueOnce({ data: {} })

    const wrapper = mount(WorkshopCard, {
      props: { workshop, canEnroll: true, enrolledWorkshopIds: [] },
    })

    await wrapper.find('.workshop-card__enroll-button').trigger('click')
    await flushPromises()

    expect(enrollInWorkshop).toHaveBeenCalledWith(1)
    expect(wrapper.emitted('enrolled')).toEqual([[1]])
  })

  it('shows an error message when the enrollment request fails', async () => {
    enrollInWorkshop.mockRejectedValueOnce({ response: { status: 409 } })

    const wrapper = mount(WorkshopCard, {
      props: { workshop, canEnroll: true, enrolledWorkshopIds: [] },
    })

    await wrapper.find('.workshop-card__enroll-button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Ya estabas apuntado/a a este taller.')
    expect(wrapper.emitted('enrolled')).toBeUndefined()
  })
})
