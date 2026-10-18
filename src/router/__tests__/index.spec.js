import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import router from '../index'
import { useAuthStore } from '@/stores/auth'

beforeEach(async () => {
  setActivePinia(createPinia())
  await router.push('/')
  await router.isReady()
})

afterEach(async () => {
  await router.push('/')
})

describe('router navigation guard', () => {
  it('redirects to login when visiting the user dashboard without an authenticated user', async () => {
    await router.push({ name: 'dashboard' })
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('redirects to login when visiting the admin panel without an authenticated user', async () => {
    await router.push({ name: 'admin' })
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('allows access to the user dashboard once the user is authenticated', async () => {
    const authStore = useAuthStore()
    authStore.user = { email: 'familia@educalba.com', roles: ['ALUMNO_FAMILIA'] }

    await router.push({ name: 'dashboard' })
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('allows access to the admin panel once the user is authenticated', async () => {
    const authStore = useAuthStore()
    authStore.user = { email: 'admin@educalba.com', roles: ['ADMINISTRADOR'] }

    await router.push({ name: 'students' })
    expect(router.currentRoute.value.name).toBe('students')
  })

  it('allows access to the admin dashboard once the user is authenticated', async () => {
    const authStore = useAuthStore()
    authStore.user = { email: 'admin@educalba.com', roles: ['ADMINISTRADOR'] }

    await router.push({ name: 'admin' })
    expect(router.currentRoute.value.name).toBe('admin')
  })

  it('allows access to the admin gallery once the user is authenticated', async () => {
    const authStore = useAuthStore()
    authStore.user = { email: 'admin@educalba.com', roles: ['ADMINISTRADOR'] }

    await router.push({ name: 'admin-gallery' })
    expect(router.currentRoute.value.name).toBe('admin-gallery')
  })

  it('redirects a family account away from the admin panel to its own dashboard', async () => {
    const authStore = useAuthStore()
    authStore.user = { email: 'familia@educalba.com', roles: ['ALUMNO_FAMILIA'] }

    await router.push({ name: 'admin' })
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('redirects an administrator away from the user dashboard to the admin panel', async () => {
    const authStore = useAuthStore()
    authStore.user = { email: 'admin@educalba.com', roles: ['ADMINISTRADOR'] }

    await router.push({ name: 'dashboard' })
    expect(router.currentRoute.value.name).toBe('admin')
  })

  it('does not require authentication for the registration and password-recovery routes', async () => {
    await router.push({ name: 'register' })
    expect(router.currentRoute.value.name).toBe('register')

    await router.push({ name: 'forgot-password' })
    expect(router.currentRoute.value.name).toBe('forgot-password')

    await router.push({ name: 'reset-password' })
    expect(router.currentRoute.value.name).toBe('reset-password')
  })

  it('does not require authentication to view the contact page', async () => {
    await router.push({ name: 'contact' })
    expect(router.currentRoute.value.name).toBe('contact')
  })

  it('falls back to the not-found view for an unknown URL', async () => {
    await router.push('/esto-no-existe')
    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
