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

// Pequeño generador de carpetas con una foto, para no repetir el mismo
// objeto literal en cada test
function folderWithPhotos(id, name) {
  return {
    id,
    name,
    photos: [
      {
        id,
        imageUrl: `https://res.cloudinary.com/demo/${id}.jpg`,
        caption: '',
        uploadedAt: '2026-09-10T10:00:00',
      },
    ],
  }
}

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

  it('requests the first page using the default page and size', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: { folders: [], hasMore: false },
    })

    await mountGrid()

    expect(fetchGalleryFolders).toHaveBeenCalledWith(0, 8)
  })

  it('shows a card for each folder that has photos', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: {
        folders: [folderWithPhotos(1, 'Nuestra academia'), folderWithPhotos(2, 'Breakout Halloween')],
        hasMore: false,
      },
    })

    const wrapper = await mountGrid()

    expect(wrapper.findAllComponents(GalleryFolderCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Nuestra academia')
    expect(wrapper.text()).toContain('Breakout Halloween')
  })

  it('excludes folders that do not have any photos yet', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: {
        folders: [folderWithPhotos(1, 'Con fotos'), { id: 2, name: 'Vacía todavía', photos: [] }],
        hasMore: false,
      },
    })

    const wrapper = await mountGrid()

    expect(wrapper.text()).toContain('Con fotos')
    expect(wrapper.text()).not.toContain('Vacía todavía')
  })

  it('shows an empty state when no folder has any photos', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: { folders: [], hasMore: false },
    })

    const wrapper = await mountGrid()

    expect(wrapper.text()).toContain('Todavía no hay fotos en la galería.')
  })

  it('shows an error message when the request fails', async () => {
    fetchGalleryFolders.mockRejectedValueOnce(new Error('network error'))

    const wrapper = await mountGrid()

    expect(wrapper.text()).toContain('No hemos podido cargar la galería. Inténtalo de nuevo más tarde.')
  })

  it('shows the "load more" button when the backend reports more folders', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: { folders: [folderWithPhotos(1, 'Nuestra academia')], hasMore: true },
    })

    const wrapper = await mountGrid()

    expect(wrapper.find('.gallery-grid__load-more').exists()).toBe(true)
  })

  it('does not show the "load more" button when there are no more folders', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: { folders: [folderWithPhotos(1, 'Nuestra academia')], hasMore: false },
    })

    const wrapper = await mountGrid()

    expect(wrapper.find('.gallery-grid__load-more').exists()).toBe(false)
  })

  it('loads and appends the next page when "load more" is clicked', async () => {
    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: { folders: [folderWithPhotos(1, 'Página uno')], hasMore: true },
    })

    const wrapper = await mountGrid()

    fetchGalleryFolders.mockResolvedValueOnce({
      status: 200,
      data: { folders: [folderWithPhotos(2, 'Página dos')], hasMore: false },
    })

    await wrapper.find('.gallery-grid__load-more').trigger('click')
    await flushPromises()

    expect(fetchGalleryFolders).toHaveBeenLastCalledWith(1, 8)
    expect(wrapper.findAllComponents(GalleryFolderCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Página uno')
    expect(wrapper.text()).toContain('Página dos')
    expect(wrapper.find('.gallery-grid__load-more').exists()).toBe(false)
  })
})
