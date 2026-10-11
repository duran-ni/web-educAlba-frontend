import http from './http'

// Trae todos los alumnos dados de alta, para el listado completo del
// panel de administración
export function fetchStudents() {
  return http.get('/admin/students')
}

// Da de alta un nuevo alumno desde el panel de administración
export function createStudent(student) {
  return http.post('/admin/students', student)
}

// Actualiza los datos de un alumno ya existente
export function updateStudent(id, student) {
  return http.put(`/admin/students/${id}`, student)
}

// Da de baja (elimina) a un alumno
export function deleteStudent(id) {
  return http.delete(`/admin/students/${id}`)
}
