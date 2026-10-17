import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import {
  fetchTeachers,
  fetchAdminTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
} from '../teachers'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('teachers service', () => {
  it('requests the full list of teachers from the public endpoint', () => {
    fetchTeachers()

    expect(http.get).toHaveBeenCalledWith('/public/teachers')
  })

  it('requests the full list of teachers from the admin endpoint', () => {
    fetchAdminTeachers()

    expect(http.get).toHaveBeenCalledWith('/admin/teachers')
  })

  it('creates a new teacher via the admin endpoint', () => {
    const teacher = { name: 'Laura Gómez', specialty: 'Matemáticas' }
    createTeacher(teacher)

    expect(http.post).toHaveBeenCalledWith('/admin/teachers', teacher)
  })

  it('updates an existing teacher via the admin endpoint', () => {
    const teacher = { name: 'Laura Gómez', specialty: 'Música' }
    updateTeacher(5, teacher)

    expect(http.put).toHaveBeenCalledWith('/admin/teachers/5', teacher)
  })

  it('deletes a teacher via the admin endpoint', () => {
    deleteTeacher(5)

    expect(http.delete).toHaveBeenCalledWith('/admin/teachers/5')
  })

  it("uploads a teacher's photo as form data", () => {
    const image = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' })

    uploadTeacherPhoto(5, image)

    expect(http.post).toHaveBeenCalledWith('/admin/teachers/5/photo', expect.any(FormData), {
      headers: { 'Content-Type': undefined },
    })

    const formData = http.post.mock.calls[0][1]
    expect(formData.get('image')).toBe(image)
  })
})
