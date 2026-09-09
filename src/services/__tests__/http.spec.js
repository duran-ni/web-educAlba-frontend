import { describe, it, expect } from 'vitest'

import http from '../http'

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
