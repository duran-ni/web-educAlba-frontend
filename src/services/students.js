import http from './http'

// Trae todos los alumnos dados de alta, para el listado completo del
// panel de administración
export function fetchStudents() {
    return http.get('/admin/students')
}
