import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import StudentMaterialUploadForm from '../../student/StudentMaterialUploadForm.vue'
import { uploadStudentMaterial } from '@/services/materials'

vi.mock('@/services/materials', () => ({
  uploadStudentMaterial: vi.fn(),
}))

// Función de ayuda: simula la selección de archivos en el input de tipo "file"
function selectFiles(wrapper, files) {
  const input = wrapper.get('#student-material-files').element
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  return wrapper.get('#student-material-files').trigger('change')
}

function makePdf(name) {
  return new File(['contenido'], name, { type: 'application/pdf' })
}

function makeOversizedPdf(name) {
  const file = makePdf(name)
  Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 })
  return file
}

describe('StudentMaterialUploadForm.vue', () => {
  const props = { studentId: 7, studentName: 'Carlos Díaz' }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error when no file is selected', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await wrapper.find('form').trigger('submit.prevent')

    expect(uploadStudentMaterial).not.toHaveBeenCalled()
    expect(wrapper.find('#student-material-files-error').text()).toBe(
      'Selecciona al menos un archivo PDF',
    )
  })

  it('shows a per-file error and blocks submission when a selected file is not a PDF', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await selectFiles(wrapper, [new File(['x'], 'photo.png', { type: 'image/png' })])

    expect(wrapper.text()).toContain('Este archivo no es un PDF')

    await wrapper.find('form').trigger('submit.prevent')
    expect(uploadStudentMaterial).not.toHaveBeenCalled()
  })

  it('shows a per-file error and blocks submission when a selected file is too big', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await selectFiles(wrapper, [makeOversizedPdf('big.pdf')])

    expect(wrapper.text()).toContain('Este archivo pesa demasiado (máx. 10 MB)')

    await wrapper.find('form').trigger('submit.prevent')
    expect(uploadStudentMaterial).not.toHaveBeenCalled()
  })

  it('shows a validation error and blocks submission when a title is left empty', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await selectFiles(wrapper, [makePdf('worksheet.pdf')])
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Escribe un título para este PDF')
    expect(uploadStudentMaterial).not.toHaveBeenCalled()
  })

  it('removes a selected file from the list when "Quitar" is clicked', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await selectFiles(wrapper, [makePdf('a.pdf'), makePdf('b.pdf')])

    expect(wrapper.findAll('.student-material-upload-form__entry')).toHaveLength(2)

    await wrapper.get('.student-material-upload-form__remove').trigger('click')

    expect(wrapper.findAll('.student-material-upload-form__entry')).toHaveLength(1)
  })

  it('uploads a single PDF with its title and description, emitting "material-uploaded" then "all-uploaded"', async () => {
    const uploaded = { id: 10, studentId: 7, title: 'Worksheet 1', description: 'Ejercicios 1 y 2' }
    uploadStudentMaterial.mockResolvedValueOnce({ data: uploaded })
    const wrapper = mount(StudentMaterialUploadForm, { props })

    await selectFiles(wrapper, [makePdf('worksheet.pdf')])
    await wrapper.get('[id^="student-material-title-"]').setValue('Worksheet 1')
    await wrapper.get('[id^="student-material-description-"]').setValue('Ejercicios 1 y 2')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadStudentMaterial).toHaveBeenCalledWith({
      file: expect.anything(),
      title: 'Worksheet 1',
      description: 'Ejercicios 1 y 2',
      studentId: 7,
    })
    expect(wrapper.emitted('material-uploaded')).toEqual([[uploaded]])
    expect(wrapper.emitted('all-uploaded')).toHaveLength(1)
  })

  it('uploads several PDFs in order, emitting "material-uploaded" once per file', async () => {
    const uploadedA = { id: 10, studentId: 7, title: 'Worksheet 1' }
    const uploadedB = { id: 11, studentId: 7, title: 'Worksheet 2' }
    uploadStudentMaterial
      .mockResolvedValueOnce({ data: uploadedA })
      .mockResolvedValueOnce({ data: uploadedB })
    const wrapper = mount(StudentMaterialUploadForm, { props })

    await selectFiles(wrapper, [makePdf('a.pdf'), makePdf('b.pdf')])
    const titleInputs = wrapper.findAll('[id^="student-material-title-"]')
    await titleInputs[0].setValue('Worksheet 1')
    await titleInputs[1].setValue('Worksheet 2')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadStudentMaterial).toHaveBeenNthCalledWith(1, {
      file: expect.anything(),
      title: 'Worksheet 1',
      description: '',
      studentId: 7,
    })
    expect(uploadStudentMaterial).toHaveBeenNthCalledWith(2, {
      file: expect.anything(),
      title: 'Worksheet 2',
      description: '',
      studentId: 7,
    })
    expect(wrapper.emitted('material-uploaded')).toEqual([[uploadedA], [uploadedB]])
    expect(wrapper.emitted('all-uploaded')).toHaveLength(1)
  })

  it('stops after a failed upload and does not emit "all-uploaded", keeping prior successes', async () => {
    const uploadedA = { id: 10, studentId: 7, title: 'Worksheet 1' }
    uploadStudentMaterial
      .mockResolvedValueOnce({ data: uploadedA })
      .mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(StudentMaterialUploadForm, { props })

    await selectFiles(wrapper, [makePdf('a.pdf'), makePdf('b.pdf')])
    const titleInputs = wrapper.findAll('[id^="student-material-title-"]')
    await titleInputs[0].setValue('Worksheet 1')
    await titleInputs[1].setValue('Worksheet 2')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadStudentMaterial).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('material-uploaded')).toEqual([[uploadedA]])
    expect(wrapper.emitted('all-uploaded')).toBeUndefined()
    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido subir todos los archivos. Los que se subieron correctamente ya aparecen en el listado; vuelve a intentarlo con el resto.',
    )
  })

  it('shows "Subiendo…" and disables both buttons while the request is in flight', async () => {
    let resolveUpload
    uploadStudentMaterial.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveUpload = resolve
      }),
    )
    const wrapper = mount(StudentMaterialUploadForm, { props })

    await selectFiles(wrapper, [makePdf('worksheet.pdf')])
    await wrapper.get('[id^="student-material-title-"]').setValue('Worksheet 1')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.get('.student-material-upload-form__submit').text()).toBe('Subiendo…')
    expect(wrapper.get('.student-material-upload-form__submit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.student-material-upload-form__cancel').attributes('disabled')).toBeDefined()

    resolveUpload({ data: { id: 1, studentId: 7 } })
    await flushPromises()
  })

  it('pluralizes the submit button label when more than one file is selected', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await selectFiles(wrapper, [makePdf('a.pdf'), makePdf('b.pdf')])

    expect(wrapper.get('.student-material-upload-form__submit').text()).toBe('Subir archivos')
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(StudentMaterialUploadForm, { props })
    await wrapper.get('.student-material-upload-form__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
