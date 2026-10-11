import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useAuthStore } from '../auth'
import { login as loginRequest, logout as logoutRequest, getCurrentUser } from '@/services/auth'

vi.mock('@/services/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('starts with no authenticated user', () => {
    const store = useAuthStore()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('logs in and stores the returned user', async () => {
    loginRequest.mockResolvedValue({ data: { id: 1, email: 'ana@educalba.com' } })
    const store = useAuthStore()

    await store.login({ email: 'ana@educalba.com', password: 'ClaveSegura123' })

    expect(loginRequest).toHaveBeenCalledWith({ email: 'ana@educalba.com', password: 'ClaveSegura123' })
    expect(store.user).toEqual({ id: 1, email: 'ana@educalba.com' })
    expect(store.isAuthenticated).toBe(true)
  })

  it('clears the user after a successful logout', async () => {
    logoutRequest.mockResolvedValue()
    const store = useAuthStore()
    store.user = { id: 1, email: 'ana@educalba.com' }

    await store.logout()

    expect(logoutRequest).toHaveBeenCalled()
    expect(store.user).toBeNull()
  })

  it('clears the user even when the logout request fails', async () => {
    logoutRequest.mockRejectedValue(new Error('Network error'))
    const store = useAuthStore()
    store.user = { id: 1, email: 'ana@educalba.com' }

    await store.logout()

    expect(store.user).toBeNull()
  })

  it('restores the user when a valid session cookie exists', async () => {
    getCurrentUser.mockResolvedValue({ data: { id: 2, email: 'marcos@educalba.com' } })
    const store = useAuthStore()

    await store.checkSession()

    expect(store.user).toEqual({ id: 2, email: 'marcos@educalba.com' })
  })

  it('leaves the user as null when there is no active session', async () => {
    getCurrentUser.mockRejectedValue(new Error('401'))
    const store = useAuthStore()

    await store.checkSession()

    expect(store.user).toBeNull()
  })
})
