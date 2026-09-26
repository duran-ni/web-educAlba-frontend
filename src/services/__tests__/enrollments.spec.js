import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { submitEnrollment } from '../enrollments'

vi.mock('../http', () => ({
  default: { post: vi.fn() },
}))

describe('enrollments service', () => {
  it('posts the enrollment data to the public endpoint', () => {
    submitEnrollment({ studentName: 'Ana', age: 8, phone: '612345678', workshopIds: [1, 2] })

    expect(http.post).toHaveBeenCalledWith('/public/enrollments', {
      studentName: 'Ana',
      age: 8,
      phone: '612345678',
      workshopIds: [1, 2],
    })
  })
})
