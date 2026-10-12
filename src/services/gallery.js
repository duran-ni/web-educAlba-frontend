import http from './http'

// Consulta todas las fotos de la galería pública, ordenadas de la más
// reciente a la más antigua (tal y como las devuelve el backend)
export function fetchGalleryPhotos() {
  return http.get('/public/gallery')
}
