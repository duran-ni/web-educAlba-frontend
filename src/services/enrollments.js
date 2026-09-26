import http from './http'

// Envía la inscripción a uno o varios talleres desde el formulario público "¡Apúntate ya!"
export function submitEnrollment(payload) {
    return http.post('/public/enrollments', payload)
}
