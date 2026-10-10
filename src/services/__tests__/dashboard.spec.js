import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { fetchDashboardSummary, fetchMyProfile, fetchMyWorkshops } from '../dashboard'

vi.mock('../http', () => ({
  default: { get: vi.fn() },
}))

describe('dashboard service', () => {
  it('requests the KPI summary from the admin dashboard endpoint', () => {
    fetchDashboardSummary()

    expect(http.get).toHaveBeenCalledWith('/admin/dashboard/summary')
  })

  it("requests the logged in user's own student profile", () => {
    fetchMyProfile()

    expect(http.get).toHaveBeenCalledWith('/dashboard/me')
  })

  it("requests the logged in user's enrolled workshops", () => {
    fetchMyWorkshops()

    expect(http.get).toHaveBeenCalledWith('/dashboard/my-workshops')
  })
})
