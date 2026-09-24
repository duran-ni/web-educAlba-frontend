import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { submitInterest } from '../interestSubmissions'

vi.mock('../http', () => ({
  default: { post: vi.fn() },
}))

describe('interestSubmissions service', () => {
  it('posts the student name and course to the public endpoint', () => {
    submitInterest({ studentName: 'Juanito', courseToReinforce: 'Matemáticas 2º ESO' })

    expect(http.post).toHaveBeenCalledWith('/public/interest-submissions', {
      studentName: 'Juanito',
      courseToReinforce: 'Matemáticas 2º ESO',
    })
  })
})
