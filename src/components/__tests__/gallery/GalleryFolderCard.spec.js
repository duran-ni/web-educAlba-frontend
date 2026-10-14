import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import GalleryFolderCard from '../../gallery/GalleryFolderCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/galeria/:folderId', name: 'gallery-folder', component: { template: '<div />' } },
  ],
})

describe('GalleryFolderCard.vue', () => {
  it('links to the folder detail route using the folder id', async () => {
    const folder = {
      id: 7,
      name: 'Nuestra academia',
      photos: [
        {
          id: 1,
          imageUrl: 'https://res.cloudinary.com/demo/one.jpg',
          caption: '',
          uploadedAt: '2026-09-10T10:00:00',
        },
      ],
    }

    const wrapper = mount(GalleryFolderCard, { props: { folder }, global: { plugins: [router] } })
    await router.isReady()

    expect(wrapper.attributes('href')).toBe('/galeria/7')
    expect(wrapper.text()).toContain('Nuestra academia')
  })

  it('shows the most recent photo as the front cover', async () => {
    const folder = {
      id: 1,
      name: 'Carpeta',
      photos: [
        {
          id: 1,
          imageUrl: 'https://res.cloudinary.com/demo/recent.jpg',
          caption: '',
          uploadedAt: '2026-09-10T10:00:00',
        },
        {
          id: 2,
          imageUrl: 'https://res.cloudinary.com/demo/older.jpg',
          caption: '',
          uploadedAt: '2026-09-05T10:00:00',
        },
      ],
    }

    const wrapper = mount(GalleryFolderCard, { props: { folder }, global: { plugins: [router] } })
    await router.isReady()

    expect(wrapper.get('.gallery-folder-card__image--front').attributes('src')).toBe(
      'https://res.cloudinary.com/demo/recent.jpg'
    )
  })

  it('shows a second photo behind the cover, hidden from screen readers, when the folder has more than one', async () => {
    const folder = {
      id: 1,
      name: 'Carpeta',
      photos: [
        {
          id: 1,
          imageUrl: 'https://res.cloudinary.com/demo/recent.jpg',
          caption: '',
          uploadedAt: '2026-09-10T10:00:00',
        },
        {
          id: 2,
          imageUrl: 'https://res.cloudinary.com/demo/older.jpg',
          caption: '',
          uploadedAt: '2026-09-05T10:00:00',
        },
      ],
    }

    const wrapper = mount(GalleryFolderCard, { props: { folder }, global: { plugins: [router] } })
    await router.isReady()

    const backImage = wrapper.get('.gallery-folder-card__image--back')
    expect(backImage.attributes('src')).toBe('https://res.cloudinary.com/demo/older.jpg')
    expect(backImage.attributes('aria-hidden')).toBe('true')
  })

  it('does not show a second photo when the folder only has one', async () => {
    const folder = {
      id: 1,
      name: 'Carpeta',
      photos: [
        {
          id: 1,
          imageUrl: 'https://res.cloudinary.com/demo/only.jpg',
          caption: '',
          uploadedAt: '2026-09-10T10:00:00',
        },
      ],
    }

    const wrapper = mount(GalleryFolderCard, { props: { folder }, global: { plugins: [router] } })
    await router.isReady()

    expect(wrapper.find('.gallery-folder-card__image--back').exists()).toBe(false)
  })

  it('does not render any image when the folder has no photos', async () => {
    const folder = { id: 1, name: 'Carpeta vacía', photos: [] }

    const wrapper = mount(GalleryFolderCard, { props: { folder }, global: { plugins: [router] } })
    await router.isReady()

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Carpeta vacía')
  })
})
