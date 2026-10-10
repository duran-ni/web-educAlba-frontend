import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import UserLayout from '../UserLayout.vue'
import AppHeader from '@/components/header/AppHeader.vue'
import AppFooter from '@/components/footer/AppFooter.vue'

describe('UserLayout.vue', () => {
  it('renders the header with the user variant and a reduced footer', () => {
    const wrapper = shallowMount(UserLayout)

    expect(wrapper.findComponent(AppHeader).props('variant')).toBe('user')
    expect(wrapper.findComponent(AppFooter).props('variant')).toBe('reduced')
  })
})
