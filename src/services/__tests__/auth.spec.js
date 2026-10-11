import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { login, logout, getCurrentUser, register, requestPasswordReset, resetPassword } from '../auth'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))

describe('auth service', () => {
  it('logs in sending credentials as Basic Auth, without a remember-me param', () => {
    login({ email: 'ana@educalba.com', password: 'ClaveSegura123' })

    expect(http.get).toHaveBeenCalledWith('/auth/me', {
      auth: { username: 'ana@educalba.com', password: 'ClaveSegura123' },
      params: undefined,
      skipAuthRedirect: true,
    })
  })

  it('logs in requesting a persistent session when remember-me is checked', () => {
    login({ email: 'ana@educalba.com', password: 'ClaveSegura123', rememberMe: true })

    expect(http.get).toHaveBeenCalledWith('/auth/me', {
      auth: { username: 'ana@educalba.com', password: 'ClaveSegura123' },
      params: { 'remember-me': true },
      skipAuthRedirect: true,
    })
  })

  it('logs out by posting to the logout endpoint', () => {
    logout()

    expect(http.post).toHaveBeenCalledWith('/auth/logout')
  })

  it('checks the current session without sending credentials', () => {
    getCurrentUser()

    expect(http.get).toHaveBeenCalledWith('/auth/me', { skipAuthRedirect: true })
  })

  it('registers a new account encoding the password in Base64', () => {
    register({
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@educalba.com',
      password: 'ClaveSegura123',
      serviceOfInterest: 'Clases de Refuerzo',
      educationalStage: 'PRIMARIA',
    })

    expect(http.post).toHaveBeenCalledWith('/auth/register', {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@educalba.com',
      password: btoa('ClaveSegura123'),
      serviceOfInterest: 'Clases de Refuerzo',
      educationalStage: 'PRIMARIA',
    })
  })

  it('requests a password reset email for the given address', () => {
    requestPasswordReset('ana@educalba.com')

    expect(http.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'ana@educalba.com' })
  })

  it('resets the password encoding the new one in Base64', () => {
    resetPassword({ token: 'un-token-valido', password: 'NuevaClave456' })

    expect(http.post).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'un-token-valido',
      password: btoa('NuevaClave456'),
    })
  })
})
