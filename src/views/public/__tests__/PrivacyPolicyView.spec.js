import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import PrivacyPolicyView from '../PrivacyPolicyView.vue'

describe('PrivacyPolicyView.vue', () => {
  it('renders the title and the seven questions of the policy', () => {
    const wrapper = mount(PrivacyPolicyView)

    expect(wrapper.find('h1').text()).toBe('Política de Privacidad')
    expect(wrapper.text()).toContain('¿Quién es el responsable del tratamiento?')
    expect(wrapper.text()).toContain('¿Qué carácter tiene este documento?')
  })

  it('lists the data rights as a bullet list', () => {
    const wrapper = mount(PrivacyPolicyView)

    const items = wrapper.findAll('.privacy-policy-view__list li')
    expect(items).toHaveLength(6)
    expect(items[0].text()).toBe('Acceder a tus datos personales.')
  })

  it('links the contact email as a mailto link', () => {
    const wrapper = mount(PrivacyPolicyView)

    const mailLinks = wrapper.findAll('a[href="mailto:refuerzoeducalba@gmail.com"]')
    expect(mailLinks.length).toBeGreaterThan(0)
  })
})
