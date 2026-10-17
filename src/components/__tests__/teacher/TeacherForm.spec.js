import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import TeacherForm from '../../teacher/TeacherForm.vue'
import { createTeacher, updateTeacher, uploadTeacherPhoto } from '@/services/teachers'

vi.mock('@/services/teachers', () => ({
  createTeacher: vi.fn(),
  updateTeacher: vi.fn(),
  uploadTeacherPhoto: vi.fn(),
}))

const EXISTING_TEACHER = {
  id: 5,
  name: 'Laura Gómez',
  specialty: 'Matemáticas',
}

const EXISTING_TEACHER_WITH_PHOTO = {
  ...EXISTING_TEACHER,
  photoUrl: 'https://res.cloudinary.com/demo/laura.jpg',
}

async function fillValidForm(wrapper) {
  await wrapper.get('#teacher-name').setValue('Marcos Ruiz')
  await wrapper.get('#teacher-specialty').setValue('Educación Física')
}

// jsdom no implementa URL.createObjectURL/revokeObjectURL de forma nativa,
// asi que se simulan para que el componente (que las usa para la vista
// previa de la foto) no falle al ejecutarse en los tests
function selectPhoto(wrapper, file) {
  const input = wrapper.get('#teacher-photo')
  Object.defineProperty(input.element, 'files', { value: file ? [file] : [], configurable: true })
  return input.trigger('change')
}

describe('TeacherForm.vue', () => {
  beforeEach(() => {
    let blobCount = 0
    global.URL.createObjectURL = vi.fn(() => `blob:mock-preview-url-${blobCount++}`)
    global.URL.revokeObjectURL = vi.fn()
  })

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

  it("pre-fills the photo preview when editing a teacher that already has one", () => {
    const wrapper = mount(TeacherForm, { props: { teacher: EXISTING_TEACHER_WITH_PHOTO } })

    expect(wrapper.get('.teacher-form__preview').attributes('src')).toBe(
      EXISTING_TEACHER_WITH_PHOTO.photoUrl
    )
  })

  it('does not show a photo preview when creating a new teacher', () => {
    const wrapper = mount(TeacherForm)

    expect(wrapper.find('.teacher-form__preview').exists()).toBe(false)
  })

  it('shows a preview generated in the browser when a photo file is selected', async () => {
    const wrapper = mount(TeacherForm)
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })

    await selectPhoto(wrapper, file)

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(wrapper.get('.teacher-form__preview').attributes('src')).toBe('blob:mock-preview-url-0')
  })

  it('revokes the previous browser preview when a second photo is selected', async () => {
    const wrapper = mount(TeacherForm)
    const firstFile = new File(['contenido-1'], 'foto1.jpg', { type: 'image/jpeg' })
    const secondFile = new File(['contenido-2'], 'foto2.jpg', { type: 'image/jpeg' })

    await selectPhoto(wrapper, firstFile)
    await selectPhoto(wrapper, secondFile)

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-preview-url-0')
    expect(wrapper.get('.teacher-form__preview').attributes('src')).toBe('blob:mock-preview-url-1')
  })

  it('falls back to the teacher\'s original photo when the file selection is cleared', async () => {
    const wrapper = mount(TeacherForm, { props: { teacher: EXISTING_TEACHER_WITH_PHOTO } })
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })

    await selectPhoto(wrapper, file)
    await selectPhoto(wrapper, null)

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-preview-url-0')
    expect(wrapper.get('.teacher-form__preview').attributes('src')).toBe(
      EXISTING_TEACHER_WITH_PHOTO.photoUrl
    )
  })

  it('revokes the browser preview when the form is closed without saving', async () => {
    const wrapper = mount(TeacherForm)
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })

    await selectPhoto(wrapper, file)
    wrapper.unmount()

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-preview-url-0')
  })

  it('creates a new teacher and emits "created" with the response data when no photo is selected', async () => {
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
    expect(uploadTeacherPhoto).not.toHaveBeenCalled()
    expect(wrapper.emitted('created')).toEqual([[created]])
  })

  it('uploads the selected photo after creating a new teacher and emits the photo response', async () => {
    const created = { id: 9, name: 'Marcos Ruiz', specialty: 'Educación Física', photoUrl: null }
    const withPhoto = { ...created, photoUrl: 'https://res.cloudinary.com/demo/marcos.jpg' }
    createTeacher.mockResolvedValueOnce({ data: created })
    uploadTeacherPhoto.mockResolvedValueOnce({ data: withPhoto })

    const wrapper = mount(TeacherForm)
    await fillValidForm(wrapper)
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    await selectPhoto(wrapper, file)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadTeacherPhoto).toHaveBeenCalledWith(9, file)
    expect(wrapper.emitted('created')).toEqual([[withPhoto]])
  })

  it('uploads the selected photo after updating an existing teacher and emits the photo response', async () => {
    const updated = { ...EXISTING_TEACHER, specialty: 'Música', photoUrl: null }
    const withPhoto = { ...updated, photoUrl: 'https://res.cloudinary.com/demo/laura-nueva.jpg' }
    updateTeacher.mockResolvedValueOnce({ data: updated })
    uploadTeacherPhoto.mockResolvedValueOnce({ data: withPhoto })

    const wrapper = mount(TeacherForm, { props: { teacher: EXISTING_TEACHER } })
    await wrapper.get('#teacher-specialty').setValue('Música')
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    await selectPhoto(wrapper, file)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadTeacherPhoto).toHaveBeenCalledWith(EXISTING_TEACHER.id, file)
    expect(wrapper.emitted('updated')).toEqual([[withPhoto]])
  })

  it('shows a photo-specific error but still emits the teacher data when the photo upload fails', async () => {
    const created = { id: 9, name: 'Marcos Ruiz', specialty: 'Educación Física', photoUrl: null }
    createTeacher.mockResolvedValueOnce({ data: created })
    uploadTeacherPhoto.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(TeacherForm)
    await fillValidForm(wrapper)
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })
    await selectPhoto(wrapper, file)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'El profesor se ha guardado, pero no hemos podido subir la foto. Puedes volver a intentarlo editándolo de nuevo.'
    )
    expect(wrapper.emitted('created')).toEqual([[created]])
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
