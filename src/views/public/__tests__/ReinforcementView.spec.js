import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import ReinforcementView from '../ReinforcementView.vue'
import ReinforcementStages from '@/components/ReinforcementStages.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/contacto', name: 'contact', component: { template: '<div />' } },
  ],
})

describe('ReinforcementView.vue', () => {
  it('renders the reinforcement stages and a link to the contact page with a prefilled subject', async () => {
    const wrapper = mount(ReinforcementView, {
      global: { plugins: [router] },
    })
    await router.isReady()

    expect(wrapper.findComponent(ReinforcementStages).exists()).toBe(true)

    const link = wrapper.get('.tutoring-cta__button')
    expect(link.attributes('href')).toBe('/contacto?subject=Solicitud+de+tutor%C3%ADa+personalizada')
  })
})
