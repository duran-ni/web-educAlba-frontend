import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import GalleryFolderView from '../GalleryFolderView.vue'
import GalleryPhotoCard from '@/components/gallery/GalleryPhotoCard.vue'
import { fetchGalleryFolder } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  fetchGalleryFolder: vi.fn(),
}))

// Pequeño generador de fotos, para no repetir el mismo objeto literal
// en cada test
function photo(id) {
  return {
    id,
    imageUrl: `https://res.cloudinary.com/demo/${id}.jpg`,
    caption: '',
    uploadedAt: '2026-09-10T10:00:00',
  }
}

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

  it('fetches the first page using the folder id from the route and the default size', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [], hasMore: false },
    })

    await mountWithRoute('/galeria/1')

    expect(fetchGalleryFolder).toHaveBeenCalledWith(1, 0, 8)
  })

  it('shows the folder name and a card for each of its photos', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [photo(1), photo(2)], hasMore: false },
    })

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.text()).toContain('Nuestra academia')
    expect(wrapper.findAllComponents(GalleryPhotoCard)).toHaveLength(2)
  })

  it('shows an empty state when the folder exists but has no photos', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Carpeta vacía', photos: [], hasMore: false },
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

  it('shows the "load more" button when the backend reports more photos', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [photo(1)], hasMore: true },
    })

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.find('.folder-view__load-more').exists()).toBe(true)
  })

  it('does not show the "load more" button when there are no more photos', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [photo(1)], hasMore: false },
    })

    const wrapper = await mountWithRoute('/galeria/1')

    expect(wrapper.find('.folder-view__load-more').exists()).toBe(false)
  })

  it('loads and appends the next page when "load more" is clicked', async () => {
    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [photo(1)], hasMore: true },
    })

    const wrapper = await mountWithRoute('/galeria/1')

    fetchGalleryFolder.mockResolvedValueOnce({
      status: 200,
      data: { id: 1, name: 'Nuestra academia', photos: [photo(2)], hasMore: false },
    })

    await wrapper.find('.folder-view__load-more').trigger('click')
    await flushPromises()

    expect(fetchGalleryFolder).toHaveBeenLastCalledWith(1, 1, 8)
    expect(wrapper.findAllComponents(GalleryPhotoCard)).toHaveLength(2)
    expect(wrapper.find('.folder-view__load-more').exists()).toBe(false)
  })
})
