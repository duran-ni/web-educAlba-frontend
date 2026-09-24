import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import AuthLayout from '../AuthLayout.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

describe('AuthLayout.vue', () => {
  it('renders the header and footer with the reduced variant', () => {
    const wrapper = shallowMount(AuthLayout)

    expect(wrapper.findComponent(AppHeader).props('variant')).toBe('reduced')
    expect(wrapper.findComponent(AppFooter).props('variant')).toBe('reduced')
  })
})
