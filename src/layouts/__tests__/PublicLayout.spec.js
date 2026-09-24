import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import PublicLayout from '../PublicLayout.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

describe('PublicLayout.vue', () => {
  it('renders the header and footer with the full variant', () => {
    const wrapper = shallowMount(PublicLayout)

    expect(wrapper.findComponent(AppHeader).props('variant')).toBe('full')
    expect(wrapper.findComponent(AppFooter).props('variant')).toBe('full')
  })
})
