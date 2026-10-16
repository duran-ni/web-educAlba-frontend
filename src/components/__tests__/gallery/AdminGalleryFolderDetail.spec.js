import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import AdminGalleryFolderDetail from '../../gallery/AdminGalleryFolderDetail.vue'

const folder = { id: 1, name: 'Taller de robótica', photoCount: 2, coverPhotoId: 20 }
const photos = [
  { id: 10, imageUrl: 'https://example.com/10.jpg', caption: '' },
  { id: 20, imageUrl: 'https://example.com/20.jpg', caption: 'Clase de robótica' },
]

describe('AdminGalleryFolderDetail.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the folder name and emits "back" when clicked', async () => {
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    expect(wrapper.get('.admin-gallery-folder-detail__title').text()).toBe('Taller de robótica')
    await wrapper.get('.admin-gallery-folder-detail__back').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('emits "upload-photo" with the folder when "Subir foto" is clicked', async () => {
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    await wrapper.get('.admin-gallery-folder-detail__upload').trigger('click')
    expect(wrapper.emitted('upload-photo')).toEqual([[folder]])
  })

  it('shows an empty-state message when the folder has no photos', () => {
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos: [] } })
    expect(wrapper.get('.admin-gallery-folder-detail__empty').text()).toBe('Esta carpeta todavía no tiene fotos.')
    expect(wrapper.find('.admin-gallery-folder-detail__photos').exists()).toBe(false)
  })

  it('shows the "Portada" badge only on the cover photo and hides "Marcar como portada" for it', () => {
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')

    expect(items[1].find('.admin-gallery-folder-detail__photo-cover-badge').exists()).toBe(true)
    expect(items[1].find('.admin-gallery-folder-detail__photo-cover').exists()).toBe(false)

    expect(items[0].find('.admin-gallery-folder-detail__photo-cover-badge').exists()).toBe(false)
    expect(items[0].find('.admin-gallery-folder-detail__photo-cover').exists()).toBe(true)
  })

  it('emits "set-cover" with the folder and photo ids when "Marcar como portada" is clicked', async () => {
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[0].get('.admin-gallery-folder-detail__photo-cover').trigger('click')
    expect(wrapper.emitted('set-cover')).toEqual([[{ folderId: 1, photoId: 10 }]])
  })

  it('emits "edit-caption" with the photo when "Editar pie de foto" is clicked', async () => {
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[1].get('.admin-gallery-folder-detail__photo-edit').trigger('click')
    expect(wrapper.emitted('edit-caption')).toEqual([[photos[1]]])
  })

  it('emits "delete-folder" with the folder id when the deletion is confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    await wrapper.get('.admin-gallery-folder-detail__delete-folder').trigger('click')
    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.emitted('delete-folder')).toEqual([[1]])
  })

  it('does not emit "delete-folder" when the deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    await wrapper.get('.admin-gallery-folder-detail__delete-folder').trigger('click')
    expect(wrapper.emitted('delete-folder')).toBeUndefined()
  })

  it('emits "delete-photo" with the photo when the deletion is confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[1].get('.admin-gallery-folder-detail__photo-delete').trigger('click')
    expect(wrapper.emitted('delete-photo')).toEqual([[photos[1]]])
  })

  it('does not emit "delete-photo" when the deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = mount(AdminGalleryFolderDetail, { props: { folder, photos } })
    const items = wrapper.findAll('.admin-gallery-folder-detail__photo')
    await items[0].get('.admin-gallery-folder-detail__photo-delete').trigger('click')
    expect(wrapper.emitted('delete-photo')).toBeUndefined()
  })
})
