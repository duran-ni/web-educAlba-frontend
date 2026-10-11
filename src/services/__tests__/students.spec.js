import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../students'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('students service', () => {
  it('requests the full list of students from the admin endpoint', () => {
    fetchStudents()

    expect(http.get).toHaveBeenCalledWith('/admin/students')
  })

  it('creates a new student via the admin endpoint', () => {
    const student = { firstName: 'Lucía', lastName: 'García López' }

    createStudent(student)

    expect(http.post).toHaveBeenCalledWith('/admin/students', student)
  })

  it('updates an existing student by id', () => {
    const student = { firstName: 'Lucía' }

    updateStudent(7, student)

    expect(http.put).toHaveBeenCalledWith('/admin/students/7', student)
  })

  it('deletes a student by id', () => {
    deleteStudent(7)

    expect(http.delete).toHaveBeenCalledWith('/admin/students/7')
  })
})
