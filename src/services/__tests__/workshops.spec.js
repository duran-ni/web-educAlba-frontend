import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import {
  fetchNextWorkshop,
  fetchWorkshops,
  fetchAdminWorkshops,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} from '../workshops'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
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

  it('requests the full list of workshops (active and inactive) from the admin endpoint', () => {
    fetchAdminWorkshops()

    expect(http.get).toHaveBeenCalledWith('/admin/workshops')
  })

  it('creates a new workshop via the admin endpoint', () => {
    const workshop = { name: 'Teatro' }
    createWorkshop(workshop)

    expect(http.post).toHaveBeenCalledWith('/admin/workshops', workshop)
  })

  it('updates an existing workshop via the admin endpoint', () => {
    const workshop = { name: 'Teatro' }
    updateWorkshop(5, workshop)

    expect(http.put).toHaveBeenCalledWith('/admin/workshops/5', workshop)
  })

  it('deletes a workshop via the admin endpoint', () => {
    deleteWorkshop(5)

    expect(http.delete).toHaveBeenCalledWith('/admin/workshops/5')
  })
})
