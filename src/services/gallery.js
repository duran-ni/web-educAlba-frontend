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

// --- Panel de administración ---

// Consulta todas las carpetas sin paginar (nombre, fecha, número de fotos
// y portada), para el listado del panel de administración
export function fetchAdminGalleryFolders() {
  return http.get('/admin/gallery/folders')
}

// Crea una carpeta nueva desde el panel de administración
export function createGalleryFolder(folder) {
  return http.post('/admin/gallery/folders', folder)
}

// Marca una foto como portada de una carpeta
export function setGalleryFolderCover(folderId, photoId) {
  return http.put(`/admin/gallery/folders/${folderId}/cover`, { photoId })
}

// Elimina una carpeta. El backend responde 409 si todavía tiene fotos dentro
export function deleteGalleryFolder(id) {
  return http.delete(`/admin/gallery/folders/${id}`)
}

// Consulta todas las fotos de la galería (de todas las carpetas), para
// cruzarlas por folderId en el panel de administración
export function fetchAdminGalleryPhotos() {
  return http.get('/admin/gallery')
}

// Sube una foto nueva a una carpeta. Se usa FormData porque el backend
// espera multipart/form-data: un fichero de imagen no se puede enviar como
// JSON. El Content-Type se deja en "undefined" a propósito
export function uploadGalleryPhoto({ image, caption, folderId }) {
  const formData = new FormData()
  formData.append('image', image)
  if (caption) {
    formData.append('caption', caption)
  }
  formData.append('folderId', folderId)

  return http.post('/admin/gallery', formData, {
    headers: { 'Content-Type': undefined },
  })
}

// Actualiza el pie de foto de una fotografía ya subida
export function updateGalleryPhotoCaption(id, caption) {
  return http.put(`/admin/gallery/${id}`, { caption })
}

// Elimina una foto de la galería
export function deleteGalleryPhoto(id) {
  return http.delete(`/admin/gallery/${id}`)
}
