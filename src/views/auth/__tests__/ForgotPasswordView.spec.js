import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import ForgotPasswordView from '../ForgotPasswordView.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'

describe('ForgotPasswordView.vue', () => {
  it('renders the ForgotPasswordForm component', () => {
    const wrapper = shallowMount(ForgotPasswordView)

    expect(wrapper.findComponent(ForgotPasswordForm).exists()).toBe(true)
  })
})
