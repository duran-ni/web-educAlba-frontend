import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import ForgotPasswordForm from '../../auth/ForgotPasswordForm.vue'
import { requestPasswordReset } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  requestPasswordReset: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: { template: '<div />' } },
    { path: '/recuperar-contrasena', name: 'forgot-password', component: { template: '<div />' } },
  ],
})

function mountForm() {
  return mount(ForgotPasswordForm, { global: { plugins: [router] } })
}

describe('ForgotPasswordForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error when the email is empty', async () => {
    const wrapper = mountForm()

    await wrapper.find('form').trigger('submit.prevent')

    expect(requestPasswordReset).not.toHaveBeenCalled()
    expect(wrapper.find('#forgot-password-email-error').text()).toBe('Escribe tu email')
  })

  it('rejects an invalid email format', async () => {
    const wrapper = mountForm()

    await wrapper.get('#forgot-password-email').setValue('no-es-un-email')
    await wrapper.find('form').trigger('submit.prevent')

    expect(requestPasswordReset).not.toHaveBeenCalled()
    expect(wrapper.find('#forgot-password-email-error').text()).toBe('Escribe un email válido')
  })

  it('shows the same confirmation message on success, whether or not the email is registered', async () => {
    requestPasswordReset.mockResolvedValueOnce({})
    const wrapper = mountForm()

    await wrapper.get('#forgot-password-email').setValue('familia@educalba.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(requestPasswordReset).toHaveBeenCalledWith('familia@educalba.com')
    expect(wrapper.find('.forgot-password-form--success').exists()).toBe(true)
    expect(wrapper.text()).toContain('familia@educalba.com')
  })

  it('shows an error message when the request genuinely fails', async () => {
    requestPasswordReset.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mountForm()

    await wrapper.get('#forgot-password-email').setValue('familia@educalba.com')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido procesar la solicitud. Inténtalo de nuevo en unos minutos.',
    )
  })
})
