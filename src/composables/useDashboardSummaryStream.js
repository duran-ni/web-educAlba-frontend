import { onUnmounted } from 'vue'

// Se suscribe al stream SSE (Server-Sent Events) del resumen del Dashboard
// del Administrador y ejecuta onChange cada vez que el backend avisa de un
// cambio (crear/eliminar un taller, inscribir un alumno). Cierra la
// conexion automaticamente cuando el componente que lo usa se desmonta
export function useDashboardSummaryStream(onChange) {
  const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/admin/dashboard/summary/stream`, {
    withCredentials: true,
  })

  eventSource.addEventListener('summary-changed', () => {
    onChange()
  })

  onUnmounted(() => {
    eventSource.close()
  })

  return eventSource
}
