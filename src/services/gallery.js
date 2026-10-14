import http from './http'

// Consulta todas las carpetas de la galería pública, cada una con sus fotos
// ya incluidas (ordenadas de la más reciente a la más antigua)
export function fetchGalleryFolders() {
  return http.get('/public/gallery')
}
