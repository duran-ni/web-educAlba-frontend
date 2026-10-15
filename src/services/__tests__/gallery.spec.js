import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { fetchGalleryFolders, fetchGalleryFolder } from '../gallery'

vi.mock('../http', () => ({
  default: { get: vi.fn() },
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
})
