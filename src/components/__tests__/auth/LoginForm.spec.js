import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import LoginForm from '../../auth/LoginForm.vue'
import { login } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  login: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: { template: '<div />' } },
    { path: '/registro', name: 'register', component: { template: '<div />' } },
    { path: '/recuperar-contrasena', name: 'forgot-password', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
    { path: '/admin', name: 'admin', component: { template: '<div />' } },
  ],
})

function mountForm() {
  return mount(LoginForm, { global: { plugins: [router, createPinia()] } })
}

describe('LoginForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    const wrapper = mountForm()

    await wrapper.find('form').trigger('submit.prevent')

    expect(login).not.toHaveBeenCalled()
    expect(wrapper.find('#login-email-error').text()).toBe('Escribe tu usuario o email')
    expect(wrapper.find('#login-password-error').text()).toBe('Escribe tu contraseña')
  })

  it('toggles the password field between hidden and visible text', async () => {
    const wrapper = mountForm()
    const passwordInput = wrapper.get('#login-password')

    expect(passwordInput.attributes('type')).toBe('password')

    await wrapper.get('.login-form__toggle-password').trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')

    await wrapper.get('.login-form__toggle-password').trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('logs in and redirects a family user to their dashboard', async () => {
    login.mockResolvedValueOnce({
      data: { email: 'familia@educalba.com', roles: ['ALUMNO_FAMILIA'] },
    })
    const wrapper = mountForm()

    await wrapper.get('#login-email').setValue('familia@educalba.com')
    await wrapper.get('#login-password').setValue('Clave1234')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(login).toHaveBeenCalledWith({
      email: 'familia@educalba.com',
      password: 'Clave1234',
      rememberMe: false,
    })
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('logs in and redirects an administrator to the admin panel, sending rememberMe', async () => {
    login.mockResolvedValueOnce({
      data: { email: 'admin@educalba.com', roles: ['ADMINISTRADOR'] },
    })
    const wrapper = mountForm()

    await wrapper.get('#login-email').setValue('admin@educalba.com')
    await wrapper.get('#login-password').setValue('Clave1234')
    await wrapper.get('.login-form__remember-input').setValue(true)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(login).toHaveBeenCalledWith({
      email: 'admin@educalba.com',
      password: 'Clave1234',
      rememberMe: true,
    })
    expect(router.currentRoute.value.name).toBe('admin')
  })

  it('shows an error message when the credentials are rejected', async () => {
    login.mockRejectedValueOnce(new Error('Unauthorized'))
    const wrapper = mountForm()

    await wrapper.get('#login-email').setValue('familia@educalba.com')
    await wrapper.get('#login-password').setValue('ClaveMala')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Usuario o contraseña incorrectos.')
  })
})
