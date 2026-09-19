import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import AppHeader from '../AppHeader.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/talleres', name: 'workshops', component: { template: '<div />' } },
    { path: '/refuerzo', name: 'reinforcement', component: { template: '<div />' } },
    { path: '/quienes-somos', name: 'about', component: { template: '<div />' } },
    { path: '/que-hacemos', name: 'what-we-do', component: { template: '<div />' } },
    { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
    { path: '/admin', name: 'admin', component: { template: '<div />' } },
    { path: '/admin/gestion', name: 'management', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
    { path: '/dashboard/mis-talleres', name: 'my-workshops', component: { template: '<div />' } },
    { path: '/dashboard/mi-perfil', name: 'my-profile', component: { template: '<div />' } },
  ],
})

describe('AppHeader.vue', () => {
  it('renders the navigation menu and login button in the full variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [router] } })
    expect(wrapper.find('.nav-menu').exists()).toBe(true)
    expect(wrapper.find('.login-button').exists()).toBe(true)
  })

  it('hides the navigation menu and login button in the reduced variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      props: { variant: 'reduced' },
      global: { plugins: [router] },
    })
    expect(wrapper.find('.nav-menu').exists()).toBe(false)
    expect(wrapper.find('.login-button').exists()).toBe(false)
  })
   it('renders the admin navigation in the admin variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      props: { variant: 'admin' },
      global: { plugins: [router] },
    })
    expect(wrapper.find('.admin-nav').exists()).toBe(true)
    expect(wrapper.find('.nav-menu').exists()).toBe(false)
  })

  it('renders the user navigation and its toggle in the user variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      props: { variant: 'user' },
      global: { plugins: [router] },
    })
    expect(wrapper.find('.user-nav').exists()).toBe(true)
    expect(wrapper.find('.nav-toggle').attributes('aria-controls')).toBe('user-nav-list')
  })
})

