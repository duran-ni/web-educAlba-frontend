import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import GalleryFolderView from '../GalleryFolderView.vue'
import GalleryPhotoCard from '@/components/gallery/GalleryPhotoCard.vue'
import { fetchGalleryFolder } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  fetchGalleryFolder: vi.fn(),
}))

async function mountWithRoute(path) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
      { path: '/galeria/:folderId', name: 'gallery-folder', component: GalleryFolderView },
    ],
  })
  router.push(path)
  await router.isReady()

  const wrapper = mount(GalleryFolderView, { global: { plugins: [router] } })
  await flushPromises()
  return wrapper
}

describe('GalleryFolderView.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('always shows a link back to the gallery', async () => {
    fetchGalleryFolder.mockReturnValueOnce(new Promise(() => {}))

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.get('.folder-view__back').attributes('href')).toBe('/galeria')
  })

  it('fetches the folder matching the route id', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [] },
    })

    await mountWithRoute('/galeria/1')

    expect(fetchGalleryFolder).toHaveBeenCalledWith(1)
  })

  it('shows the folder name and a card for each of its photos', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: {
        id: 1,
        name: 'Nuestra academia',
        photos: [
          {
            id: 1,
            imageUrl: 'https://res.cloudinary.com/demo/one.jpg',
            caption: '',
            uploadedAt: '2026-09-10T10:00:00',
          },
          {
            id: 2,
            imageUrl: 'https://res.cloudinary.com/demo/two.jpg',
            caption: '',
            uploadedAt: '2026-09-05T10:00:00',
          },
        ],
      },
    })

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.text()).toContain('Nuestra academia')
    expect(wrapper.findAllComponents(GalleryPhotoCard)).toHaveLength(2)
  })

  it('shows an empty state when the folder exists but has no photos', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Carpeta vacía', photos: [] },
    })

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.text()).toContain('Esta carpeta todavía no tiene fotos.')
  })

  it('shows an error message when the folder does not exist', async () => {
    fetchGalleryFolder.mockRejectedValueOnce({ response: { status: 404 } })

    const wrapper = await mountWithRoute('/galeria/999')

    expect(wrapper.text()).toContain('No hemos podido cargar esta carpeta. Inténtalo de nuevo más tarde.')
  })

  it('shows an error message when the request fails', async () => {
    fetchGalleryFolder.mockRejectedValueOnce(new Error('network error'))

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.text()).toContain('No hemos podido cargar esta carpeta. Inténtalo de nuevo más tarde.')
  })
})
