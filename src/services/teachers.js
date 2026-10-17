import http from './http'

export function fetchTeachers() {
  return http.get('/public/teachers')
}

export function fetchAdminTeachers() {
  return http.get('/admin/teachers')
}

export function createTeacher(teacher) {
  return http.post('/admin/teachers', teacher)
}

export function updateTeacher(id, teacher) {
  return http.put(`/admin/teachers/${id}`, teacher)
}

export function deleteTeacher(id) {
  return http.delete(`/admin/teachers/${id}`)
}
