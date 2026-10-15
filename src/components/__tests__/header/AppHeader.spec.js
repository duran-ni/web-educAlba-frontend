import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import AppHeader from '../../header/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/talleres', name: 'workshops', component: { template: '<div />' } },
    { path: '/refuerzo', name: 'reinforcement', component: { template: '<div />' } },
    { path: '/quienes-somos', name: 'about', component: { template: '<div />' } },
    { path: '/que-hacemos', name: 'what-we-do', component: { template: '<div />' } },
    { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
    { path: '/contacto', name: 'contact', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
    { path: '/registro', name: 'register', component: { template: '<div />' } },
    { path: '/admin', name: 'admin', component: { template: '<div />' } },
    { path: '/admin/alumnos', name: 'students', component: { template: '<div />' } },
    { path: '/admin/galeria', name: 'admin-gallery', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
    { path: '/dashboard/mis-talleres', name: 'my-workshops', component: { template: '<div />' } },
    { path: '/dashboard/mi-perfil', name: 'my-profile', component: { template: '<div />' } },
  ],
})

function mountHeader(props) {
  const pinia = createPinia()
  setActivePinia(pinia)
  return {
    wrapper: mount(AppHeader, { props, global: { plugins: [router, pinia] } }),
    store: useAuthStore(),
  }
}

describe('AppHeader.vue', () => {
  it('renders the navigation menu, login button and register button in the full variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, { global: { plugins: [router, createPinia()] } })
    expect(wrapper.find('.nav-menu').exists()).toBe(true)
    expect(wrapper.find('.login-button').exists()).toBe(true)
    expect(wrapper.find('.register-button').exists()).toBe(true)
  })

  it('hides the navigation menu, login button and register button in the reduced variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      props: { variant: 'reduced' },
      global: { plugins: [router, createPinia()] },
    })
    expect(wrapper.find('.nav-menu').exists()).toBe(false)
    expect(wrapper.find('.login-button').exists()).toBe(false)
    expect(wrapper.find('.register-button').exists()).toBe(false)
  })

  it('renders the admin navigation and its toggle in the admin variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      props: { variant: 'admin' },
      global: { plugins: [router, createPinia()] },
    })
    expect(wrapper.find('.admin-nav').exists()).toBe(true)
    expect(wrapper.find('.nav-menu').exists()).toBe(false)
    expect(wrapper.find('.nav-toggle').attributes('aria-controls')).toBe('admin-nav-list')
  })

  it('renders the user navigation and its toggle in the user variant', async () => {
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      props: { variant: 'user' },
      global: { plugins: [router, createPinia()] },
    })
    expect(wrapper.find('.user-nav').exists()).toBe(true)
    expect(wrapper.find('.nav-toggle').attributes('aria-controls')).toBe('user-nav-list')
  })

  it('renders the dashboard button instead of the login and register buttons for an authenticated user', async () => {
    await router.push('/')
    await router.isReady()
    const { wrapper, store } = mountHeader()
    store.user = { email: 'familia@educalba.com', roles: ['ALUMNO_FAMILIA'] }
    await nextTick()

    expect(wrapper.find('.dashboard-button').exists()).toBe(true)
    expect(wrapper.find('.login-button').exists()).toBe(false)
    expect(wrapper.find('.register-button').exists()).toBe(false)
  })

  it('opens the navigation menu when the toggle button is clicked, and closes it when clicked again', async () => {
    await router.push('/')
    await router.isReady()
    const { wrapper } = mountHeader()

    const toggle = wrapper.get('.nav-toggle')
    const menuList = wrapper.get('.nav-menu__list')
    expect(menuList.classes()).not.toContain('nav-menu__list--open')

    await toggle.trigger('click')
    expect(menuList.classes()).toContain('nav-menu__list--open')

    await toggle.trigger('click')
    expect(menuList.classes()).not.toContain('nav-menu__list--open')
  })

  it('closes the open navigation menu when a navigation link is clicked', async () => {
    await router.push('/')
    await router.isReady()
    const { wrapper } = mountHeader()

    await wrapper.get('.nav-toggle').trigger('click')
    expect(wrapper.get('.nav-menu__list').classes()).toContain('nav-menu__list--open')

    await wrapper.get('.nav-menu__link').trigger('click')
    expect(wrapper.get('.nav-menu__list').classes()).not.toContain('nav-menu__list--open')
  })
})
