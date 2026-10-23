import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import RegisterForm from '../../auth/RegisterForm.vue'
import { register, login } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  register: vi.fn(),
  login: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: { template: '<div />' } },
    { path: '/registro', name: 'register', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
    {
      path: '/politica-privacidad',
      name: 'privacy-policy',
      component: { template: '<div />' },
    },
  ],
})

function mountForm() {
  return mount(RegisterForm, { global: { plugins: [router, createPinia()] } })
}

async function fillValidForm(wrapper) {
  await wrapper.get('#register-first-name').setValue('Lucía')
  await wrapper.get('#register-last-name').setValue('García López')
  await wrapper.get('#register-email').setValue('familia@educalba.com')
  await wrapper.get('#register-stage').setValue('PRIMARIA')
  await wrapper.get('#register-service').setValue('Talleres')
  await wrapper.get('#register-password').setValue('Clave1234')
  await wrapper.get('#register-confirm-password').setValue('Clave1234')
  await wrapper.get('#register-privacy-consent').setValue(true)
}

describe('RegisterForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    const wrapper = mountForm()

    await wrapper.find('form').trigger('submit.prevent')

    expect(register).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe el nombre del alumno/a')
    expect(wrapper.text()).toContain('Escribe los apellidos')
    expect(wrapper.text()).toContain('Escribe un email')
    expect(wrapper.text()).toContain('Selecciona una etapa educativa')
    expect(wrapper.text()).toContain('Selecciona un servicio')
    expect(wrapper.text()).toContain('Escribe una contraseña')
    expect(wrapper.text()).toContain('Confirma tu contraseña')
    expect(wrapper.text()).toContain('Debes aceptar la política de privacidad para continuar')
  })

  it('rejects an invalid email format', async () => {
    const wrapper = mountForm()
    await fillValidForm(wrapper)
    await wrapper.get('#register-email').setValue('no-es-un-email')

    await wrapper.find('form').trigger('submit.prevent')

    expect(register).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe un email válido')
  })

  it('rejects a password shorter than the minimum length', async () => {
    const wrapper = mountForm()
    await fillValidForm(wrapper)
    await wrapper.get('#register-password').setValue('corta')
    await wrapper.get('#register-confirm-password').setValue('corta')

    await wrapper.find('form').trigger('submit.prevent')

    expect(register).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('La contraseña debe tener al menos 8 caracteres')
  })

  it('rejects passwords that do not match', async () => {
    const wrapper = mountForm()
    await fillValidForm(wrapper)
    await wrapper.get('#register-confirm-password').setValue('OtraClave1234')

    await wrapper.find('form').trigger('submit.prevent')

    expect(register).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Las contraseñas no coinciden')
  })

  it('blocks the submission when the privacy policy checkbox is not checked', async () => {
    const wrapper = mountForm()
    await wrapper.get('#register-first-name').setValue('Lucía')
    await wrapper.get('#register-last-name').setValue('García López')
    await wrapper.get('#register-email').setValue('familia@educalba.com')
    await wrapper.get('#register-stage').setValue('PRIMARIA')
    await wrapper.get('#register-service').setValue('Talleres')
    await wrapper.get('#register-password').setValue('Clave1234')
    await wrapper.get('#register-confirm-password').setValue('Clave1234')

    await wrapper.find('form').trigger('submit.prevent')

    expect(register).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Debes aceptar la política de privacidad para continuar')
  })

  it('links "política de privacidad" to the privacy policy page, opening in a new tab', () => {
    const wrapper = mountForm()

    const link = wrapper.get('.register-form__privacy-link')
    expect(link.attributes('href')).toBe('/politica-privacidad')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('registers the account, logs in automatically and redirects to the dashboard', async () => {
    register.mockResolvedValueOnce({})
    login.mockResolvedValueOnce({ data: { email: 'familia@educalba.com', roles: [] } })
    const wrapper = mountForm()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(register).toHaveBeenCalledWith({
      firstName: 'Lucía',
      lastName: 'García López',
      email: 'familia@educalba.com',
      password: 'Clave1234',
      serviceOfInterest: 'Talleres',
      educationalStage: 'PRIMARIA',
    })
    expect(login).toHaveBeenCalledWith({ email: 'familia@educalba.com', password: 'Clave1234' })
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('shows a specific message when the email is already registered', async () => {
    register.mockRejectedValueOnce({ response: { status: 409 } })
    const wrapper = mountForm()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'Ya existe una cuenta registrada con ese email.',
    )
  })

  it('shows a generic error message for any other failure', async () => {
    register.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mountForm()
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido crear tu cuenta. Inténtalo de nuevo en unos minutos.',
    )
  })
})
