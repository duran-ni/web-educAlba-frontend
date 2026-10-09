import http from './http'

// Consulta el próximo taller activo y programado a partir de hoy.
// El backend responde 204 sin cuerpo cuando no hay ningún taller próximo.
export function fetchNextWorkshop() {
  return http.get('/public/workshops/next')
}

// Consulta el listado completo de talleres activos, ordenados por fecha
export function fetchWorkshops() {
  return http.get('/public/workshops')
}

// Consulta Todos los talleres (activos e inactivos), para el panel de administrador
export function fetchAdminWorkshops() {
  return http.get('/admin/workshops')
}

// Crea un nuevo taller desde el panel de administrador
export function createWorkshop(workshop) {
  return http.post('/admin/workshops', workshop)
}

// Elimina un taller del panel de administracion
export function deleteWorkshop(id) {
  return http.delete(`/admin/workshops/${id}`)
}
