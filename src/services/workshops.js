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
