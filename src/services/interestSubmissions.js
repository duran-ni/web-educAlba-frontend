import http from './http'

// Envía al backend los datos del formulario rápido de interés de Inicio
export function submitInterest({ studentName, courseToReinforce }) {
  return http.post('/public/interest-submissions', { studentName, courseToReinforce })
}
