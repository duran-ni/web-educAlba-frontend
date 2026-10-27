import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { submitInterest } from '../interestSubmissions'

vi.mock('../http', () => ({
  default: { post: vi.fn() },
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
})
