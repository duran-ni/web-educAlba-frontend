// Convierte la hora ISO de un taller (hh:mm:ss, tal como la envía el backend)
// en un texto legible en español, con el formato "10:00 h"
// Si no hay hora (null/undefined), devuelve una cadena vacía en vez de fallar,
// para no romper el componente que la muestra.
export function formatWorkshopTime(isoTime) {
    if (!isoTime) {
        return ''
    }
    
  const [hours, minutes] = isoTime.split(':')

  return `${hours}:${minutes} h`
}
