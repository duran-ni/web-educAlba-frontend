import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import QuickInterestForm from '../../home/QuickInterestForm.vue'
import { submitInterest } from '@/services/interestSubmissions'

vi.mock('@/services/interestSubmissions', () => ({
  submitInterest: vi.fn(),
}))

describe('QuickInterestForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error when the student name is empty', async () => {
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(submitInterest).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe el nombre del alumno')
  })

  it('blocks the submission and shows an error when the phone is empty', async () => {
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('#interest-student-name').setValue('Juanito')
    await wrapper.find('#interest-course').setValue('Matemáticas 2º ESO')
    await wrapper.find('form').trigger('submit.prevent')

    expect(submitInterest).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe un teléfono de contacto')
  })

  it('blocks the submission and shows an error when the phone format is invalid', async () => {
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('#interest-student-name').setValue('Juanito')
    await wrapper.find('#interest-course').setValue('Matemáticas 2º ESO')
    await wrapper.find('#interest-phone').setValue('123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(submitInterest).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9')
  })

  it('submits the form and shows a confirmation message on success', async () => {
    submitInterest.mockResolvedValueOnce({})
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('#interest-student-name').setValue('Juanito')
    await wrapper.find('#interest-course').setValue('Matemáticas 2º ESO')
    await wrapper.find('#interest-phone').setValue('612345678')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(submitInterest).toHaveBeenCalledWith({
      studentName: 'Juanito',
      courseToReinforce: 'Matemáticas 2º ESO',
      phone: '612345678',
    })
    expect(wrapper.find('.quick-interest-form__message--success').exists()).toBe(true)
  })

  it('shows an error message when the submission fails', async () => {
    submitInterest.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('#interest-student-name').setValue('Juanito')
    await wrapper.find('#interest-course').setValue('Matemáticas 2º ESO')
    await wrapper.find('#interest-phone').setValue('612345678')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.quick-interest-form__message--error').exists()).toBe(true)
  })
})
