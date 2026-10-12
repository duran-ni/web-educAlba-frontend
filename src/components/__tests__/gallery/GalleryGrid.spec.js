import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import GalleryGrid from '../../gallery/GalleryGrid.vue'
import { fetchGalleryPhotos } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  fetchGalleryPhotos: vi.fn(),
}))

describe('GalleryGrid.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading message while the photos are being fetched', () => {
    fetchGalleryPhotos.mockReturnValueOnce(new Promise(() => {}))

    const wrapper = mount(GalleryGrid)

    expect(wrapper.text()).toContain('Cargando fotos…')
  })

  it('shows a card for each photo once they are loaded', async () => {
    fetchGalleryPhotos.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          id: 1,
          imageUrl: 'https://res.cloudinary.com/demo/one.jpg',
          caption: 'Día de puertas abiertas',
          uploadedAt: '2026-09-10T10:00:00',
        },
        {
          id: 2,
          imageUrl: 'https://res.cloudinary.com/demo/two.jpg',
          caption: 'Taller de ciencias',
          uploadedAt: '2026-09-05T10:00:00',
        },
      ],
    })

    const wrapper = mount(GalleryGrid)
    await flushPromises()

    expect(wrapper.text()).toContain('Día de puertas abiertas')
    expect(wrapper.text()).toContain('Taller de ciencias')
  })

  it('shows an empty state when there are no photos', async () => {
    fetchGalleryPhotos.mockResolvedValueOnce({ status: 200, data: [] })

    const wrapper = mount(GalleryGrid)
    await flushPromises()

    expect(wrapper.text()).toContain('Todavía no hay fotos en la galería.')
  })

  it('shows an error message when the request fails', async () => {
    fetchGalleryPhotos.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(GalleryGrid)
    await flushPromises()

    expect(wrapper.text()).toContain('No hemos podido cargar la galería. Inténtalo de nuevo más tarde.')
  })
})
