import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import LoginView from '../LoginView.vue'
import LoginForm from '@/components/auth/LoginForm.vue'

describe('LoginView.vue', () => {
  it('renders the LoginForm component', () => {
    const wrapper = shallowMount(LoginView)

    expect(wrapper.findComponent(LoginForm).exists()).toBe(true)
  })
})
