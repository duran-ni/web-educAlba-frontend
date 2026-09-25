// Convierte la fecha ISO de un taller (aaaa-mm-dd, tal como la envía el backend)
// en texto legible en español. Se construye el Date con año/mes/día locales
export function formatWorkshopDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}
