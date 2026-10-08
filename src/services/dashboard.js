import http from './http'

// Consulta el resumen (KPIs) del Dashboard Administrador: numero de alumnos
// inscritos y de talleres activos
export function fetchDashboardSummary() {
  return http.get('/admin/dashboard/summary')
}
