import http from './http'

// Consulta una página de carpetas de la galería pública, cada una con sus
// fotos ya incluidas (ordenadas de la más reciente a la más antigua).
// page y size viajan como parámetros de consulta (query params) al backend,
// que ahora devuelve { folders, hasMore } en lugar de un array plano
export function fetchGalleryFolders(page = 0, size = 8) {
  return http.get('/public/gallery', { params: { page, size } })
}

// Consulta una página de fotos de una única carpeta de la galería pública,
// por su id. El backend devuelve { id, name, photos, hasMore }, con la foto
// de portada siempre primera en la página 0 (si la carpeta tiene una)
export function fetchGalleryFolder(id, page = 0, size = 8) {
  return http.get(`/public/gallery/${id}`, { params: { page, size } })
}
