import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import ResetPasswordForm from '../../auth/ResetPasswordForm.vue'
import { resetPassword } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  resetPassword: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: { template: '<div />' } },
    {
      path: '/recuperar-contrasena',
      name: 'forgot-password',
      component: { template: '<div />' },
    },
    {
      path: '/restablecer-contrasena',
      name: 'reset-password',
      component: { template: '<div />' },
    },
  ],
})

async function mountFormWithToken(token = 'token-valido-123') {
  await router.push({ name: 'reset-password', query: token ? { token } : {} })
  return mount(ResetPasswordForm, { global: { plugins: [router] } })
}

describe('ResetPasswordForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the invalid-link state directly when the URL has no token', async () => {
    const wrapper = await mountFormWithToken(null)

    expect(wrapper.find('.reset-password-form--info').exists()).toBe(true)
    expect(wrapper.text()).toContain('Enlace no válido')
    expect(resetPassword).not.toHaveBeenCalled()
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    const wrapper = await mountFormWithToken()

    await wrapper.find('form').trigger('submit.prevent')

    expect(resetPassword).not.toHaveBeenCalled()
    expect(wrapper.find('#reset-password-password-error').text()).toBe('Escribe una contraseña')
    expect(wrapper.find('#reset-password-confirm-password-error').text()).toBe(
      'Confirma tu contraseña'
    )
  })

  it('rejects a password shorter than the minimum length', async () => {
    const wrapper = await mountFormWithToken()

    await wrapper.get('#reset-password-password').setValue('corta')
    await wrapper.get('#reset-password-confirm-password').setValue('corta')
    await wrapper.find('form').trigger('submit.prevent')

    expect(resetPassword).not.toHaveBeenCalled()
    expect(wrapper.find('#reset-password-password-error').text()).toBe(
      'La contraseña debe tener al menos 8 caracteres'
    )
  })

  it('rejects passwords that do not match', async () => {
    const wrapper = await mountFormWithToken()

    await wrapper.get('#reset-password-password').setValue('Clave1234')
    await wrapper.get('#reset-password-confirm-password').setValue('OtraClave1234')
    await wrapper.find('form').trigger('submit.prevent')

    expect(resetPassword).not.toHaveBeenCalled()
    expect(wrapper.find('#reset-password-confirm-password-error').text()).toBe(
      'Las contraseñas no coinciden'
    )
  })

  it('updates the password and shows the success state', async () => {
    resetPassword.mockResolvedValueOnce({})
    const wrapper = await mountFormWithToken('token-valido-123')

    await wrapper.get('#reset-password-password').setValue('Clave1234')
    await wrapper.get('#reset-password-confirm-password').setValue('Clave1234')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(resetPassword).toHaveBeenCalledWith({
      token: 'token-valido-123',
      password: 'Clave1234',
    })
    expect(wrapper.text()).toContain('¡Contraseña actualizada!')
  })

  it('shows the invalid-link state with the backend message when the token is expired', async () => {
    resetPassword.mockRejectedValueOnce({
      response: { status: 400, data: { message: 'El enlace de restablecimiento ha caducado' } },
    })
    const wrapper = await mountFormWithToken()

    await wrapper.get('#reset-password-password').setValue('Clave1234')
    await wrapper.get('#reset-password-confirm-password').setValue('Clave1234')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.reset-password-form--info').exists()).toBe(true)
    expect(wrapper.text()).toContain('El enlace de restablecimiento ha caducado')
  })

  it('shows the default invalid-link message when the backend sends no message with the 400', async () => {
    resetPassword.mockRejectedValueOnce({ response: { status: 400 } })
    const wrapper = await mountFormWithToken()

    await wrapper.get('#reset-password-password').setValue('Clave1234')
    await wrapper.get('#reset-password-confirm-password').setValue('Clave1234')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.reset-password-form--info').exists()).toBe(true)
    expect(wrapper.text()).toContain('El enlace de restablecimiento no es válido.')
  })

  it('shows a generic error message for any other failure', async () => {
    resetPassword.mockRejectedValueOnce(new Error('network error'))
    const wrapper = await mountFormWithToken()

    await wrapper.get('#reset-password-password').setValue('Clave1234')
    await wrapper.get('#reset-password-confirm-password').setValue('Clave1234')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido actualizar tu contraseña. Inténtalo de nuevo en unos minutos.'
    )
  })
})
