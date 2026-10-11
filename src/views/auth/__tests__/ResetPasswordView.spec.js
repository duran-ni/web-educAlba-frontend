import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import ResetPasswordView from '../ResetPasswordView.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'

describe('ResetPasswordView.vue', () => {
  it('renders the ResetPasswordForm component', () => {
    const wrapper = shallowMount(ResetPasswordView)

    expect(wrapper.findComponent(ResetPasswordForm).exists()).toBe(true)
  })
})
