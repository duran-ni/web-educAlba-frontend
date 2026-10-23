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

  it('renders a video player with controls and its caption as aria-label when mediaType is VIDEO', () => {
    const photo = {
      id: 3,
      imageUrl: 'https://res.cloudinary.com/demo/three.mp4',
      mediaType: 'VIDEO',
      caption: 'Excursión al museo',
      uploadedAt: '2026-09-10T10:00:00',
    }

    const wrapper = mount(GalleryPhotoCard, { props: { photo } })

    const video = wrapper.get('video')
    expect(video.attributes('src')).toBe(photo.imageUrl)
    expect(video.attributes('aria-label')).toBe('Excursión al museo')
    expect(video.attributes('controls')).toBeDefined()
    expect(wrapper.find('img').exists()).toBe(false)

    // El menú contextual del navegador permitiría descargar el vídeo
    // sin pasar por el backend, así que se bloquea
    const contextMenuEvent = new Event('contextmenu', { cancelable: true })
    video.element.dispatchEvent(contextMenuEvent)
    expect(contextMenuEvent.defaultPrevented).toBe(true)
  })

  it('falls back to a generic aria-label for videos without a caption', () => {
    const photo = {
      id: 4,
      imageUrl: 'https://res.cloudinary.com/demo/four.mp4',
      mediaType: 'VIDEO',
      caption: null,
      uploadedAt: '2026-09-10T10:00:00',
    }

    const wrapper = mount(GalleryPhotoCard, { props: { photo } })

    expect(wrapper.get('video').attributes('aria-label')).toBe('Foto de la galería de Academia EducAlba')
  })
})
