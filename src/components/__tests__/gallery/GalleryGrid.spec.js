import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import GalleryGrid from '../../gallery/GalleryGrid.vue'
import GalleryFolderCard from '../../gallery/GalleryFolderCard.vue'
import { fetchGalleryFolders } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  fetchGalleryFolders: vi.fn(),
}))

// GalleryFolderCard usa RouterLink por dentro, asi que GalleryGrid necesita
// un router real (aunque sea minimo) para poder montarse sin errores
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
    { path: '/galeria/:folderId', name: 'gallery-folder', component: { template: '<div />' } },
  ],
})

async function mountGrid() {
  const wrapper = mount(GalleryGrid, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('GalleryGrid.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading message while the folders are being fetched', () => {
    fetchGalleryFolders.mockReturnValueOnce(new Promise(() => {}))

    const wrapper = mount(GalleryGrid, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Cargando fotos…')
  })

  it('shows a card for each folder that has photos', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Nuestra academia',
          photos: [
            {
              id: 1,
              imageUrl: 'https://res.cloudinary.com/demo/one.jpg',
              caption: 'Día de puertas abiertas',
              uploadedAt: '2026-09-10T10:00:00',
            },
          ],
        },
        {
          id: 2,
          name: 'Breakout Halloween',
          photos: [
            {
              id: 2,
              imageUrl: 'https://res.cloudinary.com/demo/two.jpg',
              caption: 'Taller de ciencias',
              uploadedAt: '2026-09-05T10:00:00',
            },
          ],
        },
      ],
    })

    const wrapper = await mountGrid()

    expect(wrapper.findAllComponents(GalleryFolderCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Nuestra academia')
    expect(wrapper.text()).toContain('Breakout Halloween')
  })

  it('excludes folders that do not have any photos yet', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Con fotos',
          photos: [
            {
              id: 1,
              imageUrl: 'https://res.cloudinary.com/demo/one.jpg',
              caption: '',
              uploadedAt: '2026-09-10T10:00:00',
            },
          ],
        },
        { id: 2, name: 'Vacía todavía', photos: [] },
      ],
    })

    const wrapper = await mountGrid()

    expect(wrapper.text()).toContain('Con fotos')
    expect(wrapper.text()).not.toContain('Vacía todavía')
  })

  it('shows an empty state when no folder has any photos', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({ status: 200, data: [] })

    const wrapper = await mountGrid()

    expect(wrapper.text()).toContain('Todavía no hay fotos en la galería.')
  })

  it('shows an error message when the request fails', async () => {
    fetchGalleryFolders.mockRejectedValueOnce(new Error('network error'))

    const wrapper = await mountGrid()

    expect(wrapper.text()).toContain('No hemos podido cargar la galería. Inténtalo de nuevo más tarde.')
  })
})
