import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import GalleryFolderForm from '../../gallery/GalleryFolderForm.vue'
import { createGalleryFolder } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  createGalleryFolder: vi.fn(),
}))

describe('GalleryFolderForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error when the name is empty', async () => {
    const wrapper = mount(GalleryFolderForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(createGalleryFolder).not.toHaveBeenCalled()
    expect(wrapper.find('#gallery-folder-name-error').text()).toBe('Escribe el nombre de la carpeta')
  })

  it('creates a new folder and emits "created" with the response data', async () => {
    const created = { id: 3, name: 'Taller de robótica', photoCount: 0, coverPhotoId: null }
    createGalleryFolder.mockResolvedValueOnce({ data: created })
    const wrapper = mount(GalleryFolderForm)
    await wrapper.get('#gallery-folder-name').setValue('Taller de robótica')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(createGalleryFolder).toHaveBeenCalledWith({ name: 'Taller de robótica' })
    expect(wrapper.emitted('created')).toEqual([[created]])
  })

  it('shows a generic error message when creating the folder fails', async () => {
    createGalleryFolder.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(GalleryFolderForm)
    await wrapper.get('#gallery-folder-name').setValue('Taller de robótica')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido guardar la carpeta. Inténtalo de nuevo en unos minutos.'
    )
  })

  it('shows "Guardando…" and disables both buttons while the request is in flight', async () => {
    let resolveCreate
    createGalleryFolder.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveCreate = resolve
      })
    )
    const wrapper = mount(GalleryFolderForm)
    await wrapper.get('#gallery-folder-name').setValue('Taller de robótica')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.get('.gallery-folder-form__submit').text()).toBe('Guardando…')
    expect(wrapper.get('.gallery-folder-form__submit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.gallery-folder-form__cancel').attributes('disabled')).toBeDefined()

    resolveCreate({ data: { id: 1, name: 'Taller de robótica' } })
    await flushPromises()
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(GalleryFolderForm)

    await wrapper.get('.gallery-folder-form__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
