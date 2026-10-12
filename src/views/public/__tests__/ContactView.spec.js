import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import ContactView from '../ContactView.vue'
import ContactForm from '@/components/ContactForm.vue'
import { CONTACT } from '@/config/contact'

async function mountWithRoute(path) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/contacto', name: 'contact', component: ContactView }],
  })
  router.push(path)
  await router.isReady()

  return mount(ContactView, { global: { plugins: [router] } })
}

describe('ContactView.vue', () => {
  it('passes an empty initial subject to the contact form when there is no "subject" query param', async () => {
    const wrapper = await mountWithRoute('/contacto')

    expect(wrapper.findComponent(ContactForm).props('initialSubject')).toBe('')
  })

  it('passes the "subject" query param to the contact form as the initial subject', async () => {
    const wrapper = await mountWithRoute('/contacto?subject=Solicitud de tutoría personalizada')

    expect(wrapper.findComponent(ContactForm).props('initialSubject')).toBe(
      'Solicitud de tutoría personalizada',
    )
  })

  it('shows the configured contact address', async () => {
    const wrapper = await mountWithRoute('/contacto')

    expect(wrapper.text()).toContain(CONTACT.address)
  })

  it('builds the Google Maps embed and link URLs from the search address', async () => {
    const wrapper = await mountWithRoute('/contacto')

    const iframe = wrapper.get('.contact-info__map')
    const link = wrapper.get('.contact-info__map-link')

    expect(iframe.attributes('src')).toContain('https://www.google.com/maps?q=')
    expect(iframe.attributes('src')).toContain('output=embed')
    expect(link.attributes('href')).toContain('https://www.google.com/maps/search/?api=1&query=')
  })
})
