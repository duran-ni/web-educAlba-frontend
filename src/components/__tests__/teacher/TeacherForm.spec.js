import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import TeacherForm from '../../teacher/TeacherForm.vue'
import { createTeacher, updateTeacher } from '@/services/teachers'

vi.mock('@/services/teachers', () => ({
  createTeacher: vi.fn(),
  updateTeacher: vi.fn(),
}))

const EXISTING_TEACHER = {
  id: 5,
  name: 'Laura Gómez',
  specialty: 'Matemáticas',
}

async function fillValidForm(wrapper) {
  await wrapper.get('#teacher-name').setValue('Marcos Ruiz')
  await wrapper.get('#teacher-specialty').setValue('Educación Física')
}

describe('TeacherForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    const wrapper = mount(TeacherForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(createTeacher).not.toHaveBeenCalled()
    expect(wrapper.find('#teacher-name-error').text()).toBe('Escribe el nombre del profesor')
    expect(wrapper.find('#teacher-specialty-error').text()).toBe('Escribe la especialidad')
  })

  it('pre-fills the fields and shows "Guardar cambios" when editing an existing teacher', () => {
    const wrapper = mount(TeacherForm, { props: { teacher: EXISTING_TEACHER } })

    expect(wrapper.get('#teacher-name').element.value).toBe('Laura Gómez')
    expect(wrapper.get('#teacher-specialty').element.value).toBe('Matemáticas')
    expect(wrapper.get('.teacher-form__submit').text()).toBe('Guardar cambios')
  })

  it('creates a new teacher and emits "created" with the response data', async () => {
    const created = { id: 9, name: 'Marcos Ruiz', specialty: 'Educación Física' }
    createTeacher.mockResolvedValueOnce({ data: created })
    const wrapper = mount(TeacherForm)
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(createTeacher).toHaveBeenCalledWith({
      name: 'Marcos Ruiz',
      specialty: 'Educación Física',
    })
    expect(wrapper.emitted('created')).toEqual([[created]])
  })

  it('updates an existing teacher and emits "updated" with the response data', async () => {
    const updated = { ...EXISTING_TEACHER, specialty: 'Música' }
    updateTeacher.mockResolvedValueOnce({ data: updated })
    const wrapper = mount(TeacherForm, { props: { teacher: EXISTING_TEACHER } })
    await wrapper.get('#teacher-specialty').setValue('Música')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(updateTeacher).toHaveBeenCalledWith(
      EXISTING_TEACHER.id,
      expect.objectContaining({ specialty: 'Música' })
    )
    expect(wrapper.emitted('updated')).toEqual([[updated]])
  })

  it('shows a generic error message when creating a teacher fails', async () => {
    createTeacher.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(TeacherForm)
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido guardar el profesor. Inténtalo de nuevo en unos minutos.'
    )
  })

  it('shows a generic error message when updating a teacher fails', async () => {
    updateTeacher.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(TeacherForm, { props: { teacher: EXISTING_TEACHER } })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido guardar los cambios. Inténtalo de nuevo en unos minutos.'
    )
  })

  it('shows "Guardando…" and disables both buttons while the request is in flight', async () => {
    let resolveCreate
    createTeacher.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveCreate = resolve
      })
    )
    const wrapper = mount(TeacherForm)
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.get('.teacher-form__submit').text()).toBe('Guardando…')
    expect(wrapper.get('.teacher-form__submit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.teacher-form__cancel').attributes('disabled')).toBeDefined()

    resolveCreate({ data: { id: 1 } })
    await flushPromises()
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(TeacherForm)

    await wrapper.get('.teacher-form__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
