import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import QuickInterestForm from '../QuickInterestForm.vue'
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

  it('submits the form and shows a confirmation message on success', async () => {
    submitInterest.mockResolvedValueOnce({})
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('#interest-student-name').setValue('Juanito')
    await wrapper.find('#interest-course').setValue('Matemáticas 2º ESO')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(submitInterest).toHaveBeenCalledWith({
      studentName: 'Juanito',
      courseToReinforce: 'Matemáticas 2º ESO',
    })
    expect(wrapper.find('.quick-interest-form__message--success').exists()).toBe(true)
  })

  it('shows an error message when the submission fails', async () => {
    submitInterest.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(QuickInterestForm)

    await wrapper.find('#interest-student-name').setValue('Juanito')
    await wrapper.find('#interest-course').setValue('Matemáticas 2º ESO')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.quick-interest-form__message--error').exists()).toBe(true)
  })
})
