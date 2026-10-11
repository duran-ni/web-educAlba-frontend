import { describe, it, expect, vi, afterEach } from 'vitest'

import http from '../http'
import router from '@/router'

// Se mockea el router para comprobar, sin necesidad de montar ninguna
// vista, que el interceptor de errores llama a router.push con los
// argumentos correctos cuando corresponde
vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}))

function getResponseInterceptor() {
  return http.interceptors.response.handlers[0]
}

describe('http service', () => {
  it('is configured with the correct base URL', () => {
    expect(http.defaults.baseURL).toBe(import.meta.env.VITE_API_URL)
  })

  it('sends JSON content type by default', () => {
    expect(http.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('sends credentials (cookies) with requests', () => {
    expect(http.defaults.withCredentials).toBe(true)
  })
})

describe('http service - response interceptor', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('passes through a successful response unchanged', () => {
    const response = { status: 200, data: {} }
    const { fulfilled } = getResponseInterceptor()

    expect(fulfilled(response)).toBe(response)
  })

  it('redirects to login when a request fails with 401', async () => {
    const error = { response: { status: 401 }, config: {} }
    const { rejected } = getResponseInterceptor()

    await expect(rejected(error)).rejects.toBe(error)
    expect(router.push).toHaveBeenCalledWith({ name: 'login' })
  })

  it('redirects to login when a 401 arrives without a request config at all', async () => {
    const error = { response: { status: 401 } }
    const { rejected } = getResponseInterceptor()

    await expect(rejected(error)).rejects.toBe(error)
    expect(router.push).toHaveBeenCalledWith({ name: 'login' })
  })

  it('does not redirect when the request opted out with skipAuthRedirect', async () => {
    const error = { response: { status: 401 }, config: { skipAuthRedirect: true } }
    const { rejected } = getResponseInterceptor()

    await expect(rejected(error)).rejects.toBe(error)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('does not redirect for errors other than 401', async () => {
    const error = { response: { status: 500 }, config: {} }
    const { rejected } = getResponseInterceptor()

    await expect(rejected(error)).rejects.toBe(error)
    expect(router.push).not.toHaveBeenCalled()
  })

  it('does not redirect when the error has no response at all (network error)', async () => {
    const error = { config: {} }
    const { rejected } = getResponseInterceptor()

    await expect(rejected(error)).rejects.toBe(error)
    expect(router.push).not.toHaveBeenCalled()
  })
})
