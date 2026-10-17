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

// Sube (o reemplaza) la foto de un profesor ya existente. Se usa FormData
// porque el backend espera multipart/form-data: un fichero de imagen no se
// puede enviar como JSON. El Content-Type se deja en "undefined" a propósito,
// igual que en uploadGalleryPhoto, para que el navegador añada por sí mismo
// la cabecera correcta con el boundary multipart
export function uploadTeacherPhoto(id, image) {
  const formData = new FormData()
  formData.append('image', image)

  return http.post(`/admin/teachers/${id}/photo`, formData, {
    headers: { 'Content-Type': undefined },
  })
}
