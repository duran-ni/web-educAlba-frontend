// Convierte un tamaño en bytes (tal como lo devuelve el backend en
// fileSizeBytes) en un texto legible en KB o MB. Por debajo de 1 MB se
// muestra en KB; a partir de 1 MB, en MB con un decimal.
// Si no hay tamaño (null/undefined), devuelve una cadena vacía en vez de
// fallar, igual que formatWorkshopDate/formatWorkshopTime.
export function formatFileSize(bytes) {
  if (bytes == null) {
    return ''
  }

  const kilobytes = bytes / 1024

  if (kilobytes < 1024) {
    return `${Math.round(kilobytes)} KB`
  }

  const megabytes = kilobytes / 1024
  return `${megabytes.toFixed(1)} MB`
}
