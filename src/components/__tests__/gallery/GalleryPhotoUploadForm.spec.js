import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import GalleryPhotoUploadForm from '../../gallery/GalleryPhotoUploadForm.vue'
import { uploadGalleryPhoto } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  uploadGalleryPhoto: vi.fn(),
}))

// Función de ayuda: simula la selección de archivos en el input de tipo "file"
function selectFiles(wrapper, files) {
  const input = wrapper.get('#gallery-photo-image').element
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  return wrapper.get('#gallery-photo-image').trigger('change')
}

function makeFile(name) {
  return new File(['contenido'], name, { type: 'image/png' })
}

describe('GalleryPhotoUploadForm.vue', () => {
  const props = { folderId: 4, folderName: 'Taller de robótica' }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error when no file is selected', async () => {
    const wrapper = mount(GalleryPhotoUploadForm, { props })
    await wrapper.find('form').trigger('submit.prevent')
    expect(uploadGalleryPhoto).not.toHaveBeenCalled()
    expect(wrapper.find('#gallery-photo-image-error').text()).toBe('Selecciona al menos una fotografía')
  })

  it('shows the caption field only when a single file is selected', async () => {
    const wrapper = mount(GalleryPhotoUploadForm, { props })
    await selectFiles(wrapper, [makeFile('a.png')])
    expect(wrapper.find('#gallery-photo-caption').exists()).toBe(true)

    await selectFiles(wrapper, [makeFile('a.png'), makeFile('b.png')])
    expect(wrapper.find('#gallery-photo-caption').exists()).toBe(false)
  })

  it('uploads a single photo with its caption and emits "photo-uploaded" then "all-uploaded"', async () => {
    const uploaded = { id: 10, folderId: 4, imageUrl: 'https://example.com/a.jpg', caption: 'Clase de robótica' }
    uploadGalleryPhoto.mockResolvedValueOnce({ data: uploaded })
    const wrapper = mount(GalleryPhotoUploadForm, { props })

    await selectFiles(wrapper, [makeFile('a.png')])
    await wrapper.get('#gallery-photo-caption').setValue('Clase de robótica')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadGalleryPhoto).toHaveBeenCalledWith({
      image: expect.anything(),
      caption: 'Clase de robótica',
      folderId: 4,
    })
    expect(wrapper.emitted('photo-uploaded')).toEqual([[uploaded]])
    expect(wrapper.emitted('all-uploaded')).toHaveLength(1)
  })

  it('uploads several photos without a caption and emits "photo-uploaded" once per photo', async () => {
    const uploadedA = { id: 10, folderId: 4, imageUrl: 'https://example.com/a.jpg' }
    const uploadedB = { id: 11, folderId: 4, imageUrl: 'https://example.com/b.jpg' }
    uploadGalleryPhoto.mockResolvedValueOnce({ data: uploadedA }).mockResolvedValueOnce({ data: uploadedB })
    const wrapper = mount(GalleryPhotoUploadForm, { props })

    await selectFiles(wrapper, [makeFile('a.png'), makeFile('b.png')])
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadGalleryPhoto).toHaveBeenNthCalledWith(1, { image: expect.anything(), caption: '', folderId: 4 })
    expect(uploadGalleryPhoto).toHaveBeenNthCalledWith(2, { image: expect.anything(), caption: '', folderId: 4 })
    expect(wrapper.emitted('photo-uploaded')).toEqual([[uploadedA], [uploadedB]])
    expect(wrapper.emitted('all-uploaded')).toHaveLength(1)
  })

  it('stops after a failed upload and does not emit "all-uploaded", keeping prior successes', async () => {
    const uploadedA = { id: 10, folderId: 4, imageUrl: 'https://example.com/a.jpg' }
    uploadGalleryPhoto.mockResolvedValueOnce({ data: uploadedA }).mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(GalleryPhotoUploadForm, { props })

    await selectFiles(wrapper, [makeFile('a.png'), makeFile('b.png'), makeFile('c.png')])
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(uploadGalleryPhoto).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('photo-uploaded')).toEqual([[uploadedA]])
    expect(wrapper.emitted('all-uploaded')).toBeUndefined()
    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido subir todas las fotos. Las que se subieron correctamente ya aparecen en la carpeta; vuelve a intentarlo con el resto.'
    )
  })

  it('shows "Subiendo…" and disables both buttons while the request is in flight', async () => {
    let resolveUpload
    uploadGalleryPhoto.mockReturnValueOnce(new Promise((resolve) => { resolveUpload = resolve }))
    const wrapper = mount(GalleryPhotoUploadForm, { props })

    await selectFiles(wrapper, [makeFile('a.png')])
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.get('.gallery-photo-upload-form__submit').text()).toBe('Subiendo…')
    expect(wrapper.get('.gallery-photo-upload-form__submit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.gallery-photo-upload-form__cancel').attributes('disabled')).toBeDefined()

    resolveUpload({ data: { id: 1, folderId: 4 } })
    await flushPromises()
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(GalleryPhotoUploadForm, { props })
    await wrapper.get('.gallery-photo-upload-form__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
