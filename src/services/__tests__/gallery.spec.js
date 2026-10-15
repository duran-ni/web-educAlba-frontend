import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import {
  fetchGalleryFolders,
  fetchGalleryFolder,
  fetchAdminGalleryFolders,
  createGalleryFolder,
  setGalleryFolderCover,
  deleteGalleryFolder,
  fetchAdminGalleryPhotos,
  uploadGalleryPhoto,
  updateGalleryPhotoCaption,
  deleteGalleryPhoto,
} from '../gallery'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('gallery service', () => {
  it('fetches the public gallery folders with the default page and size', () => {
    fetchGalleryFolders()

    expect(http.get).toHaveBeenCalledWith('/public/gallery', { params: { page: 0, size: 8 } })
  })

  it('fetches the public gallery folders with a custom page and size', () => {
    fetchGalleryFolders(2, 4)

    expect(http.get).toHaveBeenCalledWith('/public/gallery', { params: { page: 2, size: 4 } })
  })

  it('fetches a single gallery folder with the default page and size', () => {
    fetchGalleryFolder(1)

    expect(http.get).toHaveBeenCalledWith('/public/gallery/1', { params: { page: 0, size: 8 } })
  })

  it('fetches a single gallery folder with a custom page and size', () => {
    fetchGalleryFolder(1, 2, 4)

    expect(http.get).toHaveBeenCalledWith('/public/gallery/1', { params: { page: 2, size: 4 } })
  })

  it('fetches all gallery folders for the admin panel', () => {
    fetchAdminGalleryFolders()

    expect(http.get).toHaveBeenCalledWith('/admin/gallery/folders')
  })

  it('creates a new gallery folder', () => {
    createGalleryFolder({ name: 'Taller de robótica' })

    expect(http.post).toHaveBeenCalledWith('/admin/gallery/folders', { name: 'Taller de robótica' })
  })

  it('sets the cover photo of a folder', () => {
    setGalleryFolderCover(1, 7)

    expect(http.put).toHaveBeenCalledWith('/admin/gallery/folders/1/cover', { photoId: 7 })
  })

  it('deletes a gallery folder', () => {
    deleteGalleryFolder(1)

    expect(http.delete).toHaveBeenCalledWith('/admin/gallery/folders/1')
  })

  it('fetches all gallery photos for the admin panel', () => {
    fetchAdminGalleryPhotos()

    expect(http.get).toHaveBeenCalledWith('/admin/gallery')
  })

  it('uploads a photo with its caption and folder id as form data', () => {
    const image = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })

    uploadGalleryPhoto({ image, caption: 'Taller de robótica', folderId: 1 })

    expect(http.post).toHaveBeenCalledWith('/admin/gallery', expect.any(FormData), {
      headers: { 'Content-Type': undefined },
    })

    const formData = http.post.mock.calls[0][1]
    expect(formData.get('image')).toBe(image)
    expect(formData.get('caption')).toBe('Taller de robótica')
    expect(formData.get('folderId')).toBe('1')
  })

  it('uploads a photo without a caption when none is given', () => {
    const image = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })

    uploadGalleryPhoto({ image, folderId: 1 })

    const formData = http.post.mock.calls[0][1]
    expect(formData.has('caption')).toBe(false)
  })

  it("updates a photo's caption", () => {
    updateGalleryPhotoCaption(10, 'Nuevo pie de foto')

    expect(http.put).toHaveBeenCalledWith('/admin/gallery/10', { caption: 'Nuevo pie de foto' })
  })

  it('deletes a gallery photo', () => {
    deleteGalleryPhoto(10)

    expect(http.delete).toHaveBeenCalledWith('/admin/gallery/10')
  })
})
