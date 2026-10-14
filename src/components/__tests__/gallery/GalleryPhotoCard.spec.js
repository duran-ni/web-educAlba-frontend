import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import GalleryPhotoCard from '../../gallery/GalleryPhotoCard.vue'

describe('GalleryPhotoCard.vue', () => {
  it('shows the photo using its caption as alt text, without a visible caption', () => {
    const photo = {
      id: 1,
      imageUrl: 'https://res.cloudinary.com/demo/one.jpg',
      caption: 'Día de puertas abiertas',
      uploadedAt: '2026-09-10T10:00:00',
    }

    const wrapper = mount(GalleryPhotoCard, { props: { photo } })

    expect(wrapper.find('img').attributes('src')).toBe(photo.imageUrl)
    expect(wrapper.find('img').attributes('alt')).toBe('Día de puertas abiertas')
    expect(wrapper.find('figcaption').exists()).toBe(false)
  })

  it('falls back to a generic alt text when there is no caption', () => {
    const photo = {
      id: 2,
      imageUrl: 'https://res.cloudinary.com/demo/two.jpg',
      caption: null,
      uploadedAt: '2026-09-10T10:00:00',
    }

    const wrapper = mount(GalleryPhotoCard, { props: { photo } })

    expect(wrapper.find('img').attributes('alt')).toBe('Foto de la galería de Academia EducAlba')
  })
})
