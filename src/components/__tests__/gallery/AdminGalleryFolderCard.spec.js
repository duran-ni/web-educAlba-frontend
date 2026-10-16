import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AdminGalleryFolderCard from '../../gallery/AdminGalleryFolderCard.vue'

const folder = { id: 1, name: 'Taller de robótica', photoCount: 2, coverPhotoId: 20 }
const photos = [
  { id: 10, imageUrl: 'https://example.com/10.jpg' },
  { id: 20, imageUrl: 'https://example.com/20.jpg' },
]

describe('AdminGalleryFolderCard.vue', () => {
  it('renders the folder name and photo count', () => {
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos } })
    expect(wrapper.get('.admin-gallery-folder-card__name').text()).toBe('Taller de robótica')
    expect(wrapper.get('.admin-gallery-folder-card__count').text()).toBe('2 fotos')
  })

  it('uses the singular form when the folder has exactly one photo', () => {
    const singlePhotoFolder = { ...folder, photoCount: 1 }
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder: singlePhotoFolder, photos: [photos[0]] } })
    expect(wrapper.get('.admin-gallery-folder-card__count').text()).toBe('1 foto')
  })

  it('uses the photo matching coverPhotoId as the front image', () => {
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos } })
    expect(wrapper.get('.admin-gallery-folder-card__image--front').attributes('src')).toBe('https://example.com/20.jpg')
  })

  it('falls back to the first photo when coverPhotoId does not match any photo', () => {
    const folderWithoutCover = { ...folder, coverPhotoId: 999 }
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder: folderWithoutCover, photos } })
    expect(wrapper.get('.admin-gallery-folder-card__image--front').attributes('src')).toBe('https://example.com/10.jpg')
  })

  it('shows a second photo behind the cover when there is more than one photo', () => {
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos } })
    expect(wrapper.get('.admin-gallery-folder-card__image--back').attributes('src')).toBe('https://example.com/10.jpg')
  })

  it('does not render any image when the folder has no photos', () => {
    const emptyFolder = { ...folder, coverPhotoId: null }
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder: emptyFolder, photos: [] } })
    expect(wrapper.find('.admin-gallery-folder-card__image--front').exists()).toBe(false)
    expect(wrapper.find('.admin-gallery-folder-card__image--back').exists()).toBe(false)
  })

  it('does not render a second photo when there is only one', () => {
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos: [photos[0]] } })
    expect(wrapper.find('.admin-gallery-folder-card__image--back').exists()).toBe(false)
  })

  it('emits "select" with the folder id when clicked', async () => {
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toEqual([[1]])
  })

  it('renders a video instead of an image for the front cover when it is a video', () => {
    const videoPhotos = [
      { id: 10, imageUrl: 'https://example.com/10.jpg' },
      { id: 20, imageUrl: 'https://example.com/20.mp4', mediaType: 'VIDEO' },
    ]
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos: videoPhotos } })

    const video = wrapper.get('video.admin-gallery-folder-card__image--front')
    expect(video.attributes('src')).toBe('https://example.com/20.mp4')
    expect(video.element.muted).toBe(true)
    expect(wrapper.find('img.admin-gallery-folder-card__image--front').exists()).toBe(false)
  })

  it('renders a video instead of an image for the back photo when it is a video', () => {
    const videoPhotos = [
      { id: 10, imageUrl: 'https://example.com/10.mp4', mediaType: 'VIDEO' },
      { id: 20, imageUrl: 'https://example.com/20.jpg' },
    ]
    const wrapper = mount(AdminGalleryFolderCard, { props: { folder, photos: videoPhotos } })

    const video = wrapper.get('video.admin-gallery-folder-card__image--back')
    expect(video.attributes('src')).toBe('https://example.com/10.mp4')
    expect(wrapper.find('img.admin-gallery-folder-card__image--back').exists()).toBe(false)
  })
})
