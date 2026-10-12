import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import GalleryView from '../GalleryView.vue'
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'

describe('GalleryView.vue', () => {
  it('renders the page title', () => {
    const wrapper = shallowMount(GalleryView)

    expect(wrapper.find('h1').text()).toContain('Galería')
  })

  it('renders the gallery grid', () => {
    const wrapper = shallowMount(GalleryView)

    expect(wrapper.findComponent(GalleryGrid).exists()).toBe(true)
  })
})
