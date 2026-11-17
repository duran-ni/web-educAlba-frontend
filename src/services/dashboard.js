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

// Consulta los materiales (PDFs) subidos por el administrador para el
// alumno vinculado al usuario que ha iniciado sesion
export function fetchMyMaterials() {
  return http.get('/dashboard/my-materials')
}

// Apunta al propio alumno (el vinculado al usuario que ha iniciado sesion)
// a un taller, desde la vista publica de Talleres. A diferencia del
// formulario publico "Apuntate ya", no hace falta enviar nombre/edad/
// telefono: el backend ya conoce al alumno a partir de la sesion
export function enrollInWorkshop(workshopId) {
  return http.post(`/dashboard/my-workshops/${workshopId}`)
}
