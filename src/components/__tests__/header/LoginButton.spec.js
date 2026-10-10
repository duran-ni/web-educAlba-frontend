import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import LoginButton from '../LoginButton.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
  ],
})

describe('LoginButton.vue', () => {
  it('renders the "Acceder" label', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(LoginButton, { global: { plugins: [router] } })
    expect(wrapper.text()).toBe('Acceder')
  })

  it('links to the login route', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(LoginButton, { global: { plugins: [router] } })
    expect(wrapper.attributes('href')).toBe('/login')
  })
})
