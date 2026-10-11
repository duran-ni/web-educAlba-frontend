import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { submitEnrollment, fetchEnrollments, createEnrollment, deleteEnrollment } from '../enrollments'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
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

  it('requests all enrollments from the admin endpoint', () => {
    fetchEnrollments()

    expect(http.get).toHaveBeenCalledWith('/admin/enrollments')
  })

  it('posts a new enrollment to the admin endpoint', () => {
    const enrollment = { studentId: 1, workshopId: 2, enrollmentDate: '2026-10-11', progress: '' }

    createEnrollment(enrollment)

    expect(http.post).toHaveBeenCalledWith('/admin/enrollments', enrollment)
  })

  it('deletes an enrollment by id from the admin endpoint', () => {
    deleteEnrollment(7)

    expect(http.delete).toHaveBeenCalledWith('/admin/enrollments/7')
  })
})
