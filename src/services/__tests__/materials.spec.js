import { describe, it, expect, vi } from 'vitest'

import http from '../http'
import {
  fetchStudentMaterials,
  uploadStudentMaterial,
  updateStudentMaterial,
  deleteStudentMaterial,
} from '../materials'

vi.mock('../http', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

describe('materials service', () => {
  it('requests all materials from the admin endpoint', () => {
    fetchStudentMaterials()

    expect(http.get).toHaveBeenCalledWith('/admin/materials')
  })

  it('uploads a material as multipart form data, with the content type left undefined', () => {
    const file = new File(['fake-pdf-content'], 'worksheet.pdf', { type: 'application/pdf' })

    uploadStudentMaterial({ file, title: 'Worksheet 1', description: 'Ejercicios 1 y 2', studentId: 7 })

    expect(http.post).toHaveBeenCalledWith(
      '/admin/materials',
      expect.any(FormData),
      { headers: { 'Content-Type': undefined } },
    )

    const formData = http.post.mock.calls[0][1]
    expect(formData.get('file')).toBe(file)
    expect(formData.get('title')).toBe('Worksheet 1')
    expect(formData.get('description')).toBe('Ejercicios 1 y 2')
    expect(formData.get('studentId')).toBe('7')
  })

  it('omits the description from the form data when there is none', () => {
    const file = new File(['fake-pdf-content'], 'worksheet.pdf', { type: 'application/pdf' })

    uploadStudentMaterial({ file, title: 'Worksheet 1', description: '', studentId: 7 })

    const formData = http.post.mock.calls[0][1]
    expect(formData.has('description')).toBe(false)
  })

  it('updates a material title and description', () => {
    updateStudentMaterial(5, { title: 'Tarea de Lengua', description: 'Ejercicios 1 y 2' })

    expect(http.put).toHaveBeenCalledWith('/admin/materials/5', {
      title: 'Tarea de Lengua',
      description: 'Ejercicios 1 y 2',
    })
  })

  it('deletes a material by id', () => {
    deleteStudentMaterial(5)

    expect(http.delete).toHaveBeenCalledWith('/admin/materials/5')
  })
})
