import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import GalleryView from '../GalleryView.vue'
import PageHeading from '@/components/PageHeading.vue'

describe('GalleryView.vue', () => {
  it('renders the page heading with the correct title', () => {
    const wrapper = shallowMount(GalleryView)

    expect(wrapper.findComponent(PageHeading).props('title')).toBe('Galería')
  })
})
