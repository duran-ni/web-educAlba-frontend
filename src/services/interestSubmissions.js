import http from './http'

// Envía al backend los datos del formulario rápido de interés de Inicio
export function submitInterest({ studentName, courseToReinforce, phone }) {
  return http.post('/public/interest-submissions', { studentName, courseToReinforce, phone })
}

// Pide al backend el listado completo de solicitudes de interés para el panel de Admin
export function fetchAdminInterestSubmissions() {
  return http.get('/admin/interest-submissions')
}

// Marca una solicitud de interés como revisada por la administradora
export function markInterestSubmissionReviewed(id) {
  return http.put(`/admin/interest-submissions/${id}/reviewed`)
}
