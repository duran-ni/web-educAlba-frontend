import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import {
  submitInterest,
  fetchAdminInterestSubmissions,
  markInterestSubmissionReviewed,
} from '../interestSubmissions'

vi.mock('../http', () => ({
  default: { post: vi.fn(), get: vi.fn(), put: vi.fn() },
}))

describe('interestSubmissions service', () => {
  it('posts the student name, course and phone to the public endpoint', () => {
    submitInterest({ studentName: 'Juanito', courseToReinforce: 'Matemáticas 2º ESO', phone: '612345678' })

    expect(http.post).toHaveBeenCalledWith('/public/interest-submissions', {
      studentName: 'Juanito',
      courseToReinforce: 'Matemáticas 2º ESO',
      phone: '612345678',
    })
  })

  it('fetches all interest submissions from the admin endpoint', () => {
    fetchAdminInterestSubmissions()

    expect(http.get).toHaveBeenCalledWith('/admin/interest-submissions')
  })

  it('marks an interest submission as reviewed by id', () => {
    markInterestSubmissionReviewed(7)

    expect(http.put).toHaveBeenCalledWith('/admin/interest-submissions/7/reviewed')
  })
})
