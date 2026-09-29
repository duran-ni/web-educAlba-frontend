import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import ContactForm from '../ContactForm.vue'
import { submitContactMessage } from '@/services/contact'

vi.mock('@/services/contact', () => ({
  submitContactMessage: vi.fn(),
}))

describe('ContactForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('pre-fills the subject field when initialSubject is provided', () => {
    const wrapper = mount(ContactForm, {
      props: { initialSubject: 'Solicitud de tutoría personalizada' },
    })

    expect(wrapper.find('#contact-subject').element.value).toBe('Solicitud de tutoría personalizada')
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    const wrapper = mount(ContactForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(submitContactMessage).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe tu nombre')
    expect(wrapper.text()).toContain('Escribe tu email')
    expect(wrapper.text()).toContain('Escribe un asunto')
    expect(wrapper.text()).toContain('Escribe tu mensaje')
  })

  it('blocks the submission and shows an error when the email format is invalid', async () => {
    const wrapper = mount(ContactForm)

    await wrapper.find('#contact-name').setValue('Ana')
    await wrapper.find('#contact-email').setValue('not-an-email')
    await wrapper.find('#contact-subject').setValue('Consulta')
    await wrapper.find('#contact-message').setValue('Hola, tengo una duda.')
    await wrapper.find('form').trigger('submit.prevent')

    expect(submitContactMessage).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Escribe un email válido')
  })

  it('submits the form and shows a confirmation message on success', async () => {
    submitContactMessage.mockResolvedValueOnce({})
    const wrapper = mount(ContactForm)

    await wrapper.find('#contact-name').setValue('Ana')
    await wrapper.find('#contact-email').setValue('ana@example.com')
    await wrapper.find('#contact-subject').setValue('Consulta')
    await wrapper.find('#contact-message').setValue('Hola, tengo una duda.')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(submitContactMessage).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@example.com',
      subject: 'Consulta',
      message: 'Hola, tengo una duda.',
    })
    expect(wrapper.find('.contact-form__message--success').exists()).toBe(true)
  })

  it('shows an error message when the submission fails', async () => {
    submitContactMessage.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(ContactForm)

    await wrapper.find('#contact-name').setValue('Ana')
    await wrapper.find('#contact-email').setValue('ana@example.com')
    await wrapper.find('#contact-subject').setValue('Consulta')
    await wrapper.find('#contact-message').setValue('Hola, tengo una duda.')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('.contact-form__message--error').exists()).toBe(true)
  })
})
