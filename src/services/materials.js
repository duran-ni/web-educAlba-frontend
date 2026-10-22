import http from './http'

// Pide al backend todos los materiales (PDFs) subidos a cualquier alumno,
// para poder cruzarlos por studentId en el panel de administración —
// mismo patrón que fetchAdminGalleryPhotos() con las carpetas de la galería
export function fetchStudentMaterials() {
  return http.get('/admin/materials')
}

// Sube un material nuevo (un PDF) para un alumno. Se usa FormData porque el
// backend espera multipart/form-data: un fichero no se puede enviar como
// JSON. El Content-Type se deja en "undefined" a propósito, para que el
// propio navegador calcule el boundary del multipart (si no, se enviaría
// como "application/json", que es el Content-Type por defecto de http.js)
export function uploadStudentMaterial({ file, title, description, studentId }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  if (description) {
    formData.append('description', description)
  }
  formData.append('studentId', studentId)

  return http.post('/admin/materials', formData, {
    headers: { 'Content-Type': undefined },
  })
}

// Elimina un material ya subido
export function deleteStudentMaterial(id) {
  return http.delete(`/admin/materials/${id}`)
}
