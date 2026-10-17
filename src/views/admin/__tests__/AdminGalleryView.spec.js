import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import AdminGalleryView from '../../admin/AdminGalleryView.vue'
import {
  fetchAdminGalleryFolders,
  fetchAdminGalleryPhotos,
  createGalleryFolder,
  uploadGalleryPhoto,
  updateGalleryPhotoCaption,
  setGalleryFolderCover,
  deleteGalleryFolder,
  deleteGalleryPhoto,
} from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  fetchAdminGalleryFolders: vi.fn(),
  fetchAdminGalleryPhotos: vi.fn(),
  createGalleryFolder: vi.fn(),
  uploadGalleryPhoto: vi.fn(),
  updateGalleryPhotoCaption: vi.fn(),
  setGalleryFolderCover: vi.fn(),
  deleteGalleryFolder: vi.fn(),
  deleteGalleryPhoto: vi.fn(),
}))

// Carpeta y fotos de ejemplo reutilizadas en varios tests
const folderA = { id: 1, name: 'Taller de robótica', photoCount: 1, coverPhotoId: 10 }
const photoA = { id: 10, folderId: 1, imageUrl: 'https://example.com/10.jpg', caption: '' }
const photoB = { id: 11, folderId: 1, imageUrl: 'https://example.com/11.jpg', caption: '' }

function openFolder(wrapper, folder = folderA) {
  return wrapper.get(`[aria-label="Gestionar la carpeta ${folder.name}"]`).trigger('click')
}

describe('AdminGalleryView.vue', () => {
  beforeEach(() => {
    // jsdom no implementa showModal/close de forma realista: los sustituimos
    // para que el componente reciba el evento "close" tal como en un navegador real
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
    window.alert = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading message and then renders the folders grid', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    const wrapper = mount(AdminGalleryView)

    expect(wrapper.get('.admin-gallery-view__message').text()).toBe('Cargando carpetas…')
    await flushPromises()

    expect(wrapper.find('.admin-gallery-view__message').exists()).toBe(false)
    expect(wrapper.text()).toContain('Taller de robótica')
  })

  it('shows an error message when loading the gallery fails', async () => {
    fetchAdminGalleryFolders.mockRejectedValueOnce(new Error('network error'))
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [] })
    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    expect(wrapper.get('.admin-gallery-view__message--error').text()).toBe(
      'No hemos podido cargar la galería. Inténtalo de nuevo más tarde.'
    )
  })

  it('shows the folder detail view with only that folder\'s photos, and "back" returns to the grid', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    expect(wrapper.get('.admin-gallery-folder-detail__title').text()).toBe(folderA.name)
    expect(wrapper.findAll('.admin-gallery-folder-detail__photo')).toHaveLength(1)
    expect(wrapper.find('.admin-gallery-view__folders').exists()).toBe(false)

    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    expect(wrapper.find('.admin-gallery-folder-detail').exists()).toBe(false)
    expect(wrapper.find('.admin-gallery-view__folders').exists()).toBe(true)
  })

  it('creates a folder through the dialog and adds it to the grid', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [] })
    const newFolder = { id: 5, name: 'Graduación', photoCount: 0, coverPhotoId: null }
    createGalleryFolder.mockResolvedValueOnce({ data: newFolder })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await wrapper.get('.admin-gallery-view__new-folder').trigger('click')
    await wrapper.get('#gallery-folder-name').setValue('Graduación')
    await wrapper.find('.gallery-folder-form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Graduación')
  })

  it('uploads a photo through the dialog and updates the folder\'s photo count', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    const newPhoto = { id: 12, folderId: 1, imageUrl: 'https://example.com/12.jpg', caption: '' }
    uploadGalleryPhoto.mockResolvedValueOnce({ data: newPhoto })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__upload').trigger('click')

    const fileInput = wrapper.get('#gallery-photo-image').element
    Object.defineProperty(fileInput, 'files', {
      value: [new File(['contenido'], 'a.png', { type: 'image/png' })],
      configurable: true,
    })
    await wrapper.get('#gallery-photo-image').trigger('change')
    await wrapper.find('.gallery-photo-upload-form').trigger('submit.prevent')
    await flushPromises()

    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    expect(wrapper.get('.admin-gallery-folder-card__count').text()).toBe('2 fotos')
  })

  it('uploads a photo without changing the photo count of other folders', async () => {
    const folderB = { id: 2, name: 'Graduación', photoCount: 0, coverPhotoId: null }
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA, folderB] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    const newPhoto = { id: 12, folderId: 1, imageUrl: 'https://example.com/12.jpg', caption: '' }
    uploadGalleryPhoto.mockResolvedValueOnce({ data: newPhoto })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper, folderA)
    await wrapper.get('.admin-gallery-folder-detail__upload').trigger('click')

    const fileInput = wrapper.get('#gallery-photo-image').element
    Object.defineProperty(fileInput, 'files', {
      value: [new File(['contenido'], 'a.png', { type: 'image/png' })],
      configurable: true,
    })
    await wrapper.get('#gallery-photo-image').trigger('change')
    await wrapper.find('.gallery-photo-upload-form').trigger('submit.prevent')
    await flushPromises()

    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    const counts = wrapper.findAll('.admin-gallery-folder-card__count')
    expect(counts[0].text()).toBe('2 fotos')
    expect(counts[1].text()).toBe('0 fotos')
  })

  it('edits a photo caption through the dialog and updates it in the detail view', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    const updatedPhoto = { ...photoA, caption: 'Clase de robótica' }
    updateGalleryPhotoCaption.mockResolvedValueOnce({ data: updatedPhoto })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__photo-edit').trigger('click')
    await wrapper.get('#gallery-photo-edit-caption').setValue('Clase de robótica')
    await wrapper.find('.gallery-photo-edit-form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.get('.admin-gallery-folder-detail__photo-caption').text()).toBe('Clase de robótica')
  })

  it('edits a photo caption without changing the caption of the other photos', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA, photoB] })
    const updatedPhoto = { ...photoA, caption: 'Clase de robótica' }
    updateGalleryPhotoCaption.mockResolvedValueOnce({ data: updatedPhoto })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[0].get('.admin-gallery-folder-detail__photo-edit').trigger('click')
    await wrapper.get('#gallery-photo-edit-caption').setValue('Clase de robótica')
    await wrapper.find('.gallery-photo-edit-form').trigger('submit.prevent')
    await flushPromises()

    const updatedItems = wrapper.findAll('.admin-gallery-folder-detail__photo')
    expect(updatedItems[0].get('.admin-gallery-folder-detail__photo-caption').text()).toBe('Clase de robótica')
    expect(updatedItems[1].find('.admin-gallery-folder-detail__photo-caption').exists()).toBe(false)
  })

  it('updates the folder when a photo is successfully set as the cover', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA, photoB] })
    const updatedFolder = { ...folderA, coverPhotoId: photoB.id }
    setGalleryFolderCover.mockResolvedValueOnce({ data: updatedFolder })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[1].get('.admin-gallery-folder-detail__photo-cover').trigger('click')
    await flushPromises()

    expect(setGalleryFolderCover).toHaveBeenCalledWith(folderA.id, photoB.id)
    expect(items[1].find('.admin-gallery-folder-detail__photo-cover-badge').exists()).toBe(true)
  })

  it('updates the correct folder when setting the cover, leaving other folders untouched', async () => {
    const folderB = { id: 2, name: 'Graduación', photoCount: 0, coverPhotoId: null }
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA, folderB] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA, photoB] })
    const updatedFolder = { ...folderA, coverPhotoId: photoB.id }
    setGalleryFolderCover.mockResolvedValueOnce({ data: updatedFolder })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper, folderA)
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[1].get('.admin-gallery-folder-detail__photo-cover').trigger('click')
    await flushPromises()

    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    expect(wrapper.text()).toContain('Graduación')
  })

  it('shows an alert when setting the cover photo fails', async () => {
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA, photoB] })
    setGalleryFolderCover.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[1].get('.admin-gallery-folder-detail__photo-cover').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith('No se ha podido cambiar la portada de la carpeta. Inténtalo de nuevo.')
  })

  it('deletes the folder when confirmed, closing the detail view and removing it from the grid', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    deleteGalleryFolder.mockResolvedValueOnce({})

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__delete-folder').trigger('click')
    await flushPromises()

    expect(wrapper.find('.admin-gallery-folder-detail').exists()).toBe(false)
    expect(wrapper.get('.admin-gallery-view__message').text()).toBe('Todavía no hay carpetas creadas.')
  })

  it('shows a specific alert when deleting a folder that still has photos (409)', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    deleteGalleryFolder.mockRejectedValueOnce({ response: { status: 409 } })

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__delete-folder').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se puede eliminar esta carpeta porque todavía tiene fotos. Elimina antes sus fotos.'
    )
  })

  it('shows a generic alert when deleting a folder fails for another reason', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    deleteGalleryFolder.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__delete-folder').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith('No se ha podido eliminar la carpeta. Inténtalo de nuevo.')
  })

  it('deletes a photo, decrements the photo count and clears the cover if it was the cover photo', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    deleteGalleryPhoto.mockResolvedValueOnce({})

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__photo-delete').trigger('click')
    await flushPromises()

    expect(wrapper.find('.admin-gallery-folder-detail__photo').exists()).toBe(false)
    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    expect(wrapper.get('.admin-gallery-folder-card__count').text()).toBe('0 fotos')
  })

  it('deletes a non-cover photo, keeps the cover, decrements the count, and leaves other folders untouched', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const folderB = { id: 2, name: 'Graduación', photoCount: 0, coverPhotoId: null }
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA, folderB] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA, photoB] })
    deleteGalleryPhoto.mockResolvedValueOnce({})

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper, folderA)
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    // photoB (items[1]) no es la portada: la portada de folderA es photoA (coverPhotoId: 10)
    await items[1].get('.admin-gallery-folder-detail__photo-delete').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('.admin-gallery-folder-detail__photo')).toHaveLength(1)
    expect(wrapper.get('.admin-gallery-folder-detail__photo-cover-badge').exists()).toBe(true)

    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    const counts = wrapper.findAll('.admin-gallery-folder-card__count')
    expect(counts[0].text()).toBe('0 fotos')
    expect(counts[1].text()).toBe('0 fotos')
  })

  it('shows an alert when deleting a photo fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fetchAdminGalleryFolders.mockResolvedValueOnce({ data: [folderA] })
    fetchAdminGalleryPhotos.mockResolvedValueOnce({ data: [photoA] })
    deleteGalleryPhoto.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(AdminGalleryView)
    await flushPromises()

    await openFolder(wrapper)
    await wrapper.get('.admin-gallery-folder-detail__photo-delete').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith('No se ha podido eliminar la foto. Inténtalo de nuevo.')
  })
})
