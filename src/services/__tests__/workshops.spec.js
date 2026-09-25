import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { fetchNextWorkshop, fetchWorkshops } from '../workshops'

vi.mock('../http', () => ({
  default: { get: vi.fn() },
}))

describe('workshops service', () => {
  it('requests the next upcoming workshop from the public endpoint', () => {
    fetchNextWorkshop()

    expect(http.get).toHaveBeenCalledWith('/public/workshops/next')
  })

  it('requests the full list of active workshops from the public endpoint', () => {
    fetchWorkshops()

    expect(http.get).toHaveBeenCalledWith('/public/workshops')
  })
})
