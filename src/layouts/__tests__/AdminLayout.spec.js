import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import AdminLayout from '../AdminLayout.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

describe('AdminLayout.vue', () => {
  it('renders the header with the admin variant and a reduced footer', () => {
    const wrapper = shallowMount(AdminLayout)

    expect(wrapper.findComponent(AppHeader).props('variant')).toBe('admin')
    expect(wrapper.findComponent(AppFooter).props('variant')).toBe('reduced')
  })
})
