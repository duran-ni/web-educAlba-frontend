// Convierte la fecha ISO de un taller (aaaa-mm-dd, tal como la envía el backend)
// en texto legible en español. Se construye el Date con año/mes/día locales.
// Si no hay fecha (null/undefined), devuelve una cadena vacía en vez de fallar,
// igual que formatWorkshopTime, para no romper el componente que la muestra.
export function formatWorkshopDate(isoDate) {
  if (!isoDate) {
    return ''
  }

  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}
