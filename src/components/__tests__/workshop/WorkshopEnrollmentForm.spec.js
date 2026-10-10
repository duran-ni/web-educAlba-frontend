import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import WorkshopEnrollmentForm from '../WorkshopEnrollmentForm.vue'
import { fetchWorkshops } from '@/services/workshops'
import { submitEnrollment } from '@/services/enrollments'

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

vi.mock('@/services/enrollments', () => ({
  submitEnrollment: vi.fn(),
}))

const SAMPLE_WORKSHOPS = [
  { id: 1, name: 'Ceramics', date: '2026-10-24' },
  { id: 2, name: 'Robotics', date: '2026-10-30' },
]

describe('WorkshopEnrollmentForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a checkbox for each active workshop once loaded', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: SAMPLE_WORKSHOPS })
    const wrapper = mount(WorkshopEnrollmentForm)
    await flushPromises()

    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ceramics')
    expect(wrapper.text()).toContain('Robotics')
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: SAMPLE_WORKSHOPS })
    const wrapper = mount(WorkshopEnrollmentForm)
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')

    expect(submitEnrollment).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe el nombre del alumno/a')
    expect(wrapper.text()).toContain('Escribe la edad')
    expect(wrapper.text()).toContain('Escribe un teléfono de contacto')
    expect(wrapper.text()).toContain('Selecciona al menos un taller')
  })

  it('blocks the submission and shows an error when the phone format is invalid', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: SAMPLE_WORKSHOPS })
    const wrapper = mount(WorkshopEnrollmentForm)
    await flushPromises()

    await wrapper.find('#enrollment-student-name').setValue('Ana')
    await wrapper.find('#enrollment-age').setValue('8')
    await wrapper.find('#enrollment-phone').setValue('123')
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await wrapper.find('form').trigger('submit.prevent')

    expect(submitEnrollment).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9')
  })

  it('submits the form and shows a confirmation message on success', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: SAMPLE_WORKSHOPS })
    submitEnrollment.mockResolvedValueOnce({})
    const wrapper = mount(WorkshopEnrollmentForm)
    await flushPromises()

    await wrapper.find('#enrollment-student-name').setValue('Ana')
    await wrapper.find('#enrollment-age').setValue('8')
    await wrapper.find('#enrollment-phone').setValue('612345678')
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(submitEnrollment).toHaveBeenCalledWith({
      studentName: 'Ana',
      age: 8,
      phone: '612345678',
      workshopIds: [1],
    })
    expect(wrapper.find('.workshop-enrollment-form__message--success').exists()).toBe(true)
  })

  it('shows an error message when the submission fails', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: SAMPLE_WORKSHOPS })
    submitEnrollment.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(WorkshopEnrollmentForm)
    await flushPromises()

    await wrapper.find('#enrollment-student-name').setValue('Ana')
    await wrapper.find('#enrollment-age').setValue('8')
    await wrapper.find('#enrollment-phone').setValue('612345678')
    await wrapper.find('input[type="checkbox"]').setValue(true)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.workshop-enrollment-form__message--error').exists()).toBe(true)
  })
})
