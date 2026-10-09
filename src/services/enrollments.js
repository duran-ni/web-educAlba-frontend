import http from './http'

// Envía la inscripción a uno o varios talleres desde el formulario público "¡Apúntate ya!"
export function submitEnrollment(payload) {
    return http.post('/public/enrollments', payload)
}

// Trae todas las inscripciones (con el taller y el alumno de cada una), para
// poder filtrarlas por taller en el panel de administración
export function fetchEnrollments() {
    return http.get('/admin/enrollments')
}

// Elimina la inscripción de un alumno en un taller concreto
export function deleteEnrollment(id) {
    return http.delete(`/admin/enrollments/${id}`)
}
