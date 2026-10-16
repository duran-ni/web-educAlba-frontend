import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import GalleryPhotoEditForm from '../../gallery/GalleryPhotoEditForm.vue'
import { updateGalleryPhotoCaption } from '@/services/gallery'

vi.mock('@/services/gallery', () => ({
  updateGalleryPhotoCaption: vi.fn(),
}))

// Foto de ejemplo reutilizada en varios tests
const photo = { id: 7, imageUrl: 'https://example.com/photo-7.jpg', caption: 'Clase de robótica' }

describe('GalleryPhotoEditForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('pre-fills the caption input with the photo\'s current caption', () => {
    const wrapper = mount(GalleryPhotoEditForm, { props: { photo } })
    expect(wrapper.get('#gallery-photo-edit-caption').element.value).toBe('Clase de robótica')
  })

  it('updates the caption and emits "updated" with the response data', async () => {
    const updated = { ...photo, caption: 'Taller de robótica avanzado' }
    updateGalleryPhotoCaption.mockResolvedValueOnce({ data: updated })
    const wrapper = mount(GalleryPhotoEditForm, { props: { photo } })

    await wrapper.get('#gallery-photo-edit-caption').setValue('Taller de robótica avanzado')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(updateGalleryPhotoCaption).toHaveBeenCalledWith(photo.id, 'Taller de robótica avanzado')
    expect(wrapper.emitted('updated')).toEqual([[updated]])
  })

  it('allows submitting an empty caption to clear it', async () => {
    const updated = { ...photo, caption: '' }
    updateGalleryPhotoCaption.mockResolvedValueOnce({ data: updated })
    const wrapper = mount(GalleryPhotoEditForm, { props: { photo } })

    await wrapper.get('#gallery-photo-edit-caption').setValue('')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(updateGalleryPhotoCaption).toHaveBeenCalledWith(photo.id, '')
    expect(wrapper.emitted('updated')).toEqual([[updated]])
  })

  it('shows a generic error message when updating the caption fails', async () => {
    updateGalleryPhotoCaption.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(GalleryPhotoEditForm, { props: { photo } })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido actualizar el pie de foto. Inténtalo de nuevo en unos minutos.'
    )
  })

  it('shows "Guardando…" and disables both buttons while the request is in flight', async () => {
    let resolveUpdate
    updateGalleryPhotoCaption.mockReturnValueOnce(new Promise((resolve) => { resolveUpdate = resolve }))
    const wrapper = mount(GalleryPhotoEditForm, { props: { photo } })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.get('.gallery-photo-edit-form__submit').text()).toBe('Guardando…')
    expect(wrapper.get('.gallery-photo-edit-form__submit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.gallery-photo-edit-form__cancel').attributes('disabled')).toBeDefined()

    resolveUpdate({ data: { ...photo, caption: '' } })
    await flushPromises()
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(GalleryPhotoEditForm, { props: { photo } })
    await wrapper.get('.gallery-photo-edit-form__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
