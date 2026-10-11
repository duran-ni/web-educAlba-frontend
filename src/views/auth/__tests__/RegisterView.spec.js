import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import RegisterView from '../RegisterView.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

describe('RegisterView.vue', () => {
  it('renders the RegisterForm component', () => {
    const wrapper = shallowMount(RegisterView)

    expect(wrapper.findComponent(RegisterForm).exists()).toBe(true)
  })
})
