import http from './http'

// Consulta el resumen (KPIs) del Dashboard Administrador: numero de alumnos
// inscritos y de talleres activos
export function fetchDashboardSummary() {
  return http.get('/admin/dashboard/summary')
}

// Consulta el perfil del alumno vinculado al usuario que ha iniciado sesion,
// para el saludo de bienvenida del Dashboard del usuario (familia/alumno)
export function fetchMyProfile() {
  return http.get('/dashboard/me')
}

// Consulta los talleres en los que esta inscrito el alumno vinculado al
// usuario que ha iniciado sesion, con su progreso
export function fetchMyWorkshops() {
  return http.get('/dashboard/my-workshops')
}
