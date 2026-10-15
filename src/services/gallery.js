import http from './http'

// Consulta una página de carpetas de la galería pública, cada una con sus
// fotos ya incluidas (ordenadas de la más reciente a la más antigua).
// page y size viajan como parámetros de consulta (query params) al backend,
// que ahora devuelve { folders, hasMore } en lugar de un array plano
export function fetchGalleryFolders(page = 0, size = 8) {
  return http.get('/public/gallery', { params: { page, size } })
}

// Consulta una única carpeta de la galería pública por su id, con sus fotos
// ya incluidas. Se usa en la subpágina de carpeta en vez de pedir todas las
// carpetas y buscar la que corresponda, para que siga funcionando aunque esa
// carpeta no esté en la primera página de la galería paginada
export function fetchGalleryFolder(id) {
  return http.get(`/public/gallery/${id}`)
}
