import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import StudentForm from '../../student/StudentForm.vue'
import { createStudent } from '@/services/students'
import { createEnrollment } from '@/services/enrollments'
import { fetchWorkshops } from '@/services/workshops'

vi.mock('@/services/students', () => ({
  createStudent: vi.fn(),
}))

vi.mock('@/services/enrollments', () => ({
  createEnrollment: vi.fn(),
}))

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

describe('StudentForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation errors when submitting an empty form', async () => {
    fetchWorkshops.mockResolvedValueOnce({ data: [] })

    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Escribe el nombre del alumno/a')
    expect(wrapper.text()).toContain('Escribe los apellidos')
    expect(wrapper.text()).toContain('Selecciona una etapa educativa')
    expect(createStudent).not.toHaveBeenCalled()
  })

  it('creates the student and emits "created" when no workshop is selected', async () => {
    fetchWorkshops.mockResolvedValueOnce({ data: [] })
    createStudent.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: 'Lucía',
        lastName: 'García Pérez',
        educationalStage: 'PRIMARIA',
        serviceOfInterest: 'Clases de Refuerzo',
        status: 'ACTIVE',
      },
    })

    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.find('#student-first-name').setValue('Lucía')
    await wrapper.find('#student-last-name').setValue('García Pérez')
    await wrapper.find('#student-stage').setValue('PRIMARIA')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createStudent).toHaveBeenCalledWith({
      firstName: 'Lucía',
      lastName: 'García Pérez',
      educationalStage: 'PRIMARIA',
      serviceOfInterest: 'Clases de Refuerzo',
    })
    expect(createEnrollment).not.toHaveBeenCalled()
    expect(wrapper.emitted('created')[0][0]).toEqual({
      id: 1,
      firstName: 'Lucía',
      lastName: 'García Pérez',
      educationalStage: 'PRIMARIA',
      serviceOfInterest: 'Clases de Refuerzo',
      status: 'ACTIVE',
    })
  })

  it('shows the workshop field only when the checkbox is checked, and requires a workshop', async () => {
    fetchWorkshops.mockResolvedValueOnce({
      data: [{ id: 5, name: 'Manos a la obra' }],
    })

    const wrapper = mount(StudentForm)
    await flushPromises()

    expect(wrapper.find('#student-workshop').exists()).toBe(false)

    await wrapper.find('.student-form__checkbox').setValue(true)

    expect(wrapper.find('#student-workshop').exists()).toBe(true)

    await wrapper.find('#student-first-name').setValue('Lucía')
    await wrapper.find('#student-last-name').setValue('García Pérez')
    await wrapper.find('#student-stage').setValue('PRIMARIA')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.text()).toContain('Selecciona un taller')
    expect(createStudent).not.toHaveBeenCalled()
  })

  it('also enrolls the student in the chosen workshop', async () => {
    fetchWorkshops.mockResolvedValueOnce({
      data: [{ id: 5, name: 'Manos a la obra' }],
    })
    createStudent.mockResolvedValueOnce({
      data: { id: 1, firstName: 'Lucía', lastName: 'García Pérez' },
    })
    createEnrollment.mockResolvedValueOnce({ data: { id: 10 } })

    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.find('#student-first-name').setValue('Lucía')
    await wrapper.find('#student-last-name').setValue('García Pérez')
    await wrapper.find('#student-stage').setValue('PRIMARIA')
    await wrapper.find('.student-form__checkbox').setValue(true)
    await wrapper.find('#student-workshop').setValue('5')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createEnrollment).toHaveBeenCalledWith(
      expect.objectContaining({ studentId: 1, workshopId: 5, progress: '' })
    )
    expect(wrapper.emitted('created')).toBeTruthy()
  })

  it('shows an error message when the student request fails', async () => {
    fetchWorkshops.mockResolvedValueOnce({ data: [] })
    createStudent.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.find('#student-first-name').setValue('Lucía')
    await wrapper.find('#student-last-name').setValue('García Pérez')
    await wrapper.find('#student-stage').setValue('PRIMARIA')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('No hemos podido guardar el alumno. Inténtalo de nuevo en unos minutos.')
  })
})
