import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { fetchGalleryFolders } from '../gallery'

vi.mock('../http', () => ({
  default: { get: vi.fn() },
}))

describe('gallery service', () => {
  it('fetches the public gallery folders', () => {
    fetchGalleryFolders()

    expect(http.get).toHaveBeenCalledWith('/public/gallery')
  })
})
