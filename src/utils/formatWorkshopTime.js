// Convierte la hora ISO de un taller (hh:mm:ss, tal como la envía el backend)
// en un texto legible en español, con el formato "10:00 h"
export function formatWorkshopTime(isoTime) {
  const [hours, minutes] = isoTime.split(':')

  return `${hours}:${minutes} h`
}
