import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import StudentForm from '../../student/StudentForm.vue'
import { createStudent, updateStudent } from '@/services/students'
import { createEnrollment, deleteEnrollment } from '@/services/enrollments'
import { fetchWorkshops } from '@/services/workshops'

vi.mock('@/services/students', () => ({
  createStudent: vi.fn(),
  updateStudent: vi.fn(),
}))

vi.mock('@/services/enrollments', () => ({
  createEnrollment: vi.fn(),
  deleteEnrollment: vi.fn(),
}))

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

const STUDENT = {
  id: 1,
  firstName: 'Lucía',
  lastName: 'García',
  educationalStage: 'PRIMARIA',
  serviceOfInterest: 'Clases de Refuerzo',
}

describe('StudentForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('high mode', () => {
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
        data: { id: 1, firstName: 'Lucía', lastName: 'García Pérez', status: 'ACTIVE' },
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
      expect(wrapper.emitted('created')).toBeTruthy()
    })

    it('shows the workshop field only when the checkbox is checked, and requires a workshop', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })

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
      fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })
      createStudent.mockResolvedValueOnce({ data: { id: 1, firstName: 'Lucía' } })
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

      expect(wrapper.text()).toContain(
        'No hemos podido guardar el alumno. Inténtalo de nuevo en unos minutos.'
      )
    })
  })

  describe('edit mode', () => {
    it('preloads the student data and, if there is one, its workshop enrollment', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })

      const wrapper = mount(StudentForm, {
        props: { student: STUDENT, enrollment: { id: 20, studentId: 1, workshopId: 5 } },
      })
      await flushPromises()

      expect(wrapper.text()).toContain('Editar alumno')
      expect(wrapper.find('#student-first-name').element.value).toBe('Lucía')
      expect(wrapper.find('.student-form__checkbox').element.checked).toBe(true)
      expect(wrapper.find('#student-workshop').element.value).toBe('5')
    })

    it('updates the student and creates a new enrollment when none existed before', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })
      updateStudent.mockResolvedValueOnce({ data: { ...STUDENT } })
      createEnrollment.mockResolvedValueOnce({ data: { id: 30 } })

      const wrapper = mount(StudentForm, { props: { student: STUDENT, enrollment: null } })
      await flushPromises()

      await wrapper.find('.student-form__checkbox').setValue(true)
      await wrapper.find('#student-workshop').setValue('5')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(updateStudent).toHaveBeenCalledWith(1, expect.objectContaining({ firstName: 'Lucía' }))
      expect(createEnrollment).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 1, workshopId: 5 })
      )
      expect(deleteEnrollment).not.toHaveBeenCalled()
      expect(wrapper.emitted('updated')).toBeTruthy()
    })

    it('deletes the existing enrollment when unchecking the workshop box', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })
      updateStudent.mockResolvedValueOnce({ data: { ...STUDENT } })
      deleteEnrollment.mockResolvedValueOnce({})

      const wrapper = mount(StudentForm, {
        props: { student: STUDENT, enrollment: { id: 20, studentId: 1, workshopId: 5 } },
      })
      await flushPromises()

      await wrapper.find('.student-form__checkbox').setValue(false)
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(deleteEnrollment).toHaveBeenCalledWith(20)
      expect(createEnrollment).not.toHaveBeenCalled()
    })

    it('replaces the enrollment when choosing a different workshop', async () => {
      fetchWorkshops.mockResolvedValueOnce({
        data: [
          { id: 5, name: 'Manos a la obra' },
          { id: 6, name: 'Cuentacuentos' },
        ],
      })
      updateStudent.mockResolvedValueOnce({ data: { ...STUDENT } })
      deleteEnrollment.mockResolvedValueOnce({})
      createEnrollment.mockResolvedValueOnce({ data: { id: 31 } })

      const wrapper = mount(StudentForm, {
        props: { student: STUDENT, enrollment: { id: 20, studentId: 1, workshopId: 5 } },
      })
      await flushPromises()

      await wrapper.find('#student-workshop').setValue('6')
      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(deleteEnrollment).toHaveBeenCalledWith(20)
      expect(createEnrollment).toHaveBeenCalledWith(expect.objectContaining({ workshopId: 6 }))
    })

    it('does not touch the enrollment when the chosen workshop stays the same', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })
      updateStudent.mockResolvedValueOnce({ data: { ...STUDENT } })

      const wrapper = mount(StudentForm, {
        props: { student: STUDENT, enrollment: { id: 20, studentId: 1, workshopId: 5 } },
      })
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(createEnrollment).not.toHaveBeenCalled()
      expect(deleteEnrollment).not.toHaveBeenCalled()
    })

    it('shows an error message when updating the student fails', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [] })
      updateStudent.mockRejectedValueOnce(new Error('network error'))

      const wrapper = mount(StudentForm, { props: { student: STUDENT, enrollment: null } })
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(wrapper.text()).toContain(
        'No hemos podido guardar los cambios. Inténtalo de nuevo en unos minutos.'
      )
    })

    it('does not call the enrollment services when editing a student with no workshop and the box stays unchecked', async () => {
      fetchWorkshops.mockResolvedValueOnce({ data: [] })
      updateStudent.mockResolvedValueOnce({ data: { ...STUDENT } })

      const wrapper = mount(StudentForm, { props: { student: STUDENT, enrollment: null } })
      await flushPromises()

      await wrapper.find('form').trigger('submit')
      await flushPromises()

      expect(createEnrollment).not.toHaveBeenCalled()
      expect(deleteEnrollment).not.toHaveBeenCalled()
      expect(wrapper.emitted('updated')).toBeTruthy()
    })
  })

  it('saves the student but shows an alert when enrolling them in the workshop fails', async () => {
    fetchWorkshops.mockResolvedValueOnce({ data: [{ id: 5, name: 'Manos a la obra' }] })
    createStudent.mockResolvedValueOnce({ data: { id: 1, firstName: 'Lucía' } })
    createEnrollment.mockRejectedValueOnce(new Error('network error'))
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.find('#student-first-name').setValue('Lucía')
    await wrapper.find('#student-last-name').setValue('García Pérez')
    await wrapper.find('#student-stage').setValue('PRIMARIA')
    await wrapper.find('.student-form__checkbox').setValue(true)
    await wrapper.find('#student-workshop').setValue('5')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'Los datos del alumno se han guardado, pero no hemos podido actualizar su inscripción al taller. Puedes gestionarla desde el panel de Talleres.'
    )
    expect(wrapper.emitted('created')).toBeTruthy()
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    fetchWorkshops.mockResolvedValueOnce({ data: [] })
    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.get('.student-form__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('shows an error message inside the workshop field when the workshops fail to load', async () => {
    fetchWorkshops.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(StudentForm)
    await flushPromises()

    await wrapper.find('.student-form__checkbox').setValue(true)

    expect(wrapper.text()).toContain('No hemos podido cargar los talleres disponibles.')
  })
})
