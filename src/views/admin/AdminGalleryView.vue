<template>
  <section class="admin-gallery-view">
    <div class="admin-gallery-view__header">
      <button
        v-if="!selectedFolder"
        type="button"
        class="admin-gallery-view__new-folder"
        @click="openFolderDialog"
      >
        <span class="material-symbols-outlined" aria-hidden="true">create_new_folder</span>
        + Nueva Carpeta
      </button>
    </div>

    <h2 v-if="!selectedFolder" class="admin-gallery-view__title">Carpetas</h2>

    <p v-if="status === 'loading'" class="admin-gallery-view__message">Cargando carpetas…</p>

    <p
      v-else-if="status === 'error'"
      class="admin-gallery-view__message admin-gallery-view__message--error"
    >
      No hemos podido cargar la galería. Inténtalo de nuevo más tarde.
    </p>

    <AdminGalleryFolderDetail
      v-else-if="selectedFolder"
      :folder="selectedFolder"
      :photos="photosForFolder(selectedFolder.id)"
      @back="selectedFolderId = null"
      @upload-photo="openPhotoDialog"
      @delete-folder="handleDeleteFolder"
      @set-cover="handleSetCover"
      @delete-photo="handleDeletePhoto"
      @edit-caption="openCaptionDialog"
    />

    <p v-else-if="folders.length === 0" class="admin-gallery-view__message">
      Todavía no hay carpetas creadas.
    </p>

    <ul v-else class="admin-gallery-view__folders">
      <li v-for="folder in folders" :key="folder.id">
        <AdminGalleryFolderCard
          :folder="folder"
          :photos="photosForFolder(folder.id)"
          @select="selectedFolderId = $event"
        />
      </li>
    </ul>

    <dialog
      ref="folderDialogRef"
      class="admin-gallery-view__dialog"
      @close="handleFolderDialogClose"
    >
      <GalleryFolderForm @created="handleFolderCreated" @cancel="closeFolderDialog" />
    </dialog>

    <dialog ref="photoDialogRef" class="admin-gallery-view__dialog" @close="handlePhotoDialogClose">
      <GalleryPhotoUploadForm
        v-if="uploadTargetFolder"
        :key="uploadTargetFolder.id"
        :folder-id="uploadTargetFolder.id"
        :folder-name="uploadTargetFolder.name"
        @photo-uploaded="handlePhotoUploaded"
        @all-uploaded="closePhotoDialog"
        @cancel="closePhotoDialog"
      />
    </dialog>

    <dialog
      ref="captionDialogRef"
      class="admin-gallery-view__dialog"
      @close="handleCaptionDialogClose"
    >
      <GalleryPhotoEditForm
        v-if="editTargetPhoto"
        :key="editTargetPhoto.id"
        :photo="editTargetPhoto"
        @updated="handleCaptionUpdated"
        @cancel="closeCaptionDialog"
      />
    </dialog>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  fetchAdminGalleryFolders,
  fetchAdminGalleryPhotos,
  setGalleryFolderCover,
  deleteGalleryFolder,
  deleteGalleryPhoto,
} from '@/services/gallery'
import AdminGalleryFolderCard from '@/components/gallery/AdminGalleryFolderCard.vue'
import AdminGalleryFolderDetail from '@/components/gallery/AdminGalleryFolderDetail.vue'
import GalleryFolderForm from '@/components/gallery/GalleryFolderForm.vue'
import GalleryPhotoUploadForm from '@/components/gallery/GalleryPhotoUploadForm.vue'
import GalleryPhotoEditForm from '@/components/gallery/GalleryPhotoEditForm.vue'

// loading | loaded | error
const status = ref('loading')
const folders = ref([])
const photos = ref([])

const folderDialogRef = ref(null)
const photoDialogRef = ref(null)
const captionDialogRef = ref(null)

// Carpeta sobre la que se está subiendo una foto ahora mismo (null cuando
// el dialog de subida está cerrado)
const uploadTargetFolder = ref(null)

// Foto cuyo pie de foto se está editando ahora mismo (null cuando el
// dialog de edición está cerrado)
const editTargetPhoto = ref(null)

// Id de la carpeta seleccionada para gestionar (null muestra la rejilla de
// carpetas; con un id se muestra la vista de detalle de esa carpeta)
const selectedFolderId = ref(null)

// Se deriva de "folders" en vez de guardar la carpeta entera, para que la
// vista de detalle siempre refleje los datos más recientes (por ejemplo,
// tras cambiar la portada o borrar una foto)
const selectedFolder = computed(
  () => folders.value.find((folder) => folder.id === selectedFolderId.value) ?? null
)

onMounted(loadData)

// Carga en paralelo las carpetas y todas las fotos de la galeria, ya que la
// vista necesita cruzar ambas colecciones por folderId
async function loadData() {
  try {
    const [foldersResponse, photosResponse] = await Promise.all([
      fetchAdminGalleryFolders(),
      fetchAdminGalleryPhotos(),
    ])
    folders.value = foldersResponse.data
    photos.value = photosResponse.data
    status.value = 'loaded'
  } catch {
    status.value = 'error'
  }
}

// Filtra, del lado del frontend, las fotos que pertenecen a esta carpeta
// concreta; evita pedir al backend un listado distinto por cada carpeta
function photosForFolder(folderId) {
  return photos.value.filter((photo) => photo.folderId === folderId)
}

function openFolderDialog() {
  folderDialogRef.value.showModal()
}

function closeFolderDialog() {
  folderDialogRef.value.close()
}

function handleFolderDialogClose() {
  // No hay estado que limpiar al cerrar este dialog (a diferencia del de
  // fotos), porque GalleryFolderForm no recibe ninguna carpeta por prop
}

// Se añade la carpeta recien creada a la lista, sin volver a pedirla
// entera al backend
function handleFolderCreated(newFolder) {
  folders.value = [...folders.value, newFolder]
  closeFolderDialog()
}

function openPhotoDialog(folder) {
  uploadTargetFolder.value = folder
  photoDialogRef.value.showModal()
}

function closePhotoDialog() {
  photoDialogRef.value.close()
}

// Al cerrar el dialog de subida (tanto si se guarda como si se cancela o se
// pulsa Esc) se limpia la carpeta objetivo, para que la proxima vez que se
// abra no arrastre la carpeta de la subida anterior
function handlePhotoDialogClose() {
  uploadTargetFolder.value = null
}

// Se emite una vez por cada foto subida con éxito (el formulario puede
// subir varias de golpe): se añade a la lista y se incrementa el contador
// de fotos de su carpeta, sin volver a pedir nada al backend
function handlePhotoUploaded(newPhoto) {
  photos.value = [...photos.value, newPhoto]
  folders.value = folders.value.map((folder) =>
    folder.id === newPhoto.folderId ? { ...folder, photoCount: folder.photoCount + 1 } : folder
  )
}

function openCaptionDialog(photo) {
  editTargetPhoto.value = photo
  captionDialogRef.value.showModal()
}

function closeCaptionDialog() {
  captionDialogRef.value.close()
}

function handleCaptionDialogClose() {
  editTargetPhoto.value = null
}

// Sustituye la foto editada por la version que devuelve el backend (ya con
// su nuevo pie de foto), sin volver a pedir nada mas
function handleCaptionUpdated(updatedPhoto) {
  photos.value = photos.value.map((photo) => (photo.id === updatedPhoto.id ? updatedPhoto : photo))
  closeCaptionDialog()
}

// Marca una foto como portada en el backend y, solo si la peticion tiene
// exito, sustituye esa carpeta en el listado por la version que devuelve
// el backend (ya con su nuevo coverPhotoId)
async function handleSetCover({ folderId, photoId }) {
  try {
    const response = await setGalleryFolderCover(folderId, photoId)
    folders.value = folders.value.map((folder) => (folder.id === folderId ? response.data : folder))
  } catch {
    window.alert('No se ha podido cambiar la portada de la carpeta. Inténtalo de nuevo.')
  }
}

// Elimina la carpeta en el backend y, solo si la peticion tiene exito, la
// quita tambien del listado en memoria. Esta funcion solo se invoca desde el
// evento "delete-folder" de AdminGalleryFolderDetail, que siempre esta
// mostrando la carpeta seleccionada y siempre emite el id de esa misma
// carpeta, asi que al llegar aqui siempre estabamos gestionando justo la
// carpeta que se borra: volvemos a la rejilla sin necesidad de comprobarlo
async function handleDeleteFolder(folderId) {
  try {
    await deleteGalleryFolder(folderId)
    folders.value = folders.value.filter((folder) => folder.id !== folderId)
    selectedFolderId.value = null
  } catch (error) {
    if (error.response?.status === 409) {
      window.alert(
        'No se puede eliminar esta carpeta porque todavía tiene fotos. Elimina antes sus fotos.'
      )
    } else {
      window.alert('No se ha podido eliminar la carpeta. Inténtalo de nuevo.')
    }
  }
}

// Elimina la foto en el backend y, solo si la peticion tiene exito, la
// quita del listado en memoria y actualiza su carpeta: baja el contador de
// fotos y, si esa foto era la portada, el backend ya la desmarca por su
// cuenta (GalleryFolderService.clearCoverIfMatches), asi que replicamos
// aqui el mismo efecto para no tener que volver a pedir todo al backend
async function handleDeletePhoto(photo) {
  try {
    await deleteGalleryPhoto(photo.id)
    photos.value = photos.value.filter((item) => item.id !== photo.id)
    folders.value = folders.value.map((folder) =>
      folder.id === photo.folderId
        ? {
            ...folder,
            photoCount: folder.photoCount - 1,
            coverPhotoId: folder.coverPhotoId === photo.id ? null : folder.coverPhotoId,
          }
        : folder
    )
  } catch {
    window.alert('No se ha podido eliminar la foto. Inténtalo de nuevo.')
  }
}
</script>

<style lang="scss">
.admin-gallery-view {
  position: relative;
  padding: 1rem 1.5rem 3rem;

  &__header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.5rem;

    @include respond-to(tablet) {
      position: absolute;
      top: 2.5rem;
      right: 1.5rem;
      margin-bottom: 0;
    }
  }

  &__new-folder {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 2px solid $color-text-dark;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-background;
    font-family: $font-heading;
    font-weight: 600;
    box-shadow: 4px 4px 0 0 $color-text-dark;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover,
    &:focus-visible {
      opacity: 0.9;
    }
  }

  &__title {
    margin: 0 0 1rem;
    font-family: $font-doodle;
    font-size: 2.25rem;
    color: $color-primary;
    transform: rotate(-5deg);
    display: inline-block;

    @include respond-to(tablet) {
      font-size: 4rem;
    }
  }

  &__message {
    color: $color-text-dark;
  }

  &__message--error {
    color: $color-error;
    font-weight: 600;
  }

  &__folders {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, 16rem);
    gap: 2.5rem;
    margin: 2rem 0 0;
    padding: 0;
  }

  &__dialog {
    margin: auto;
    width: min(90vw, 40rem);
    padding: 2rem;
    border: 2px solid $color-text-dark;
    border-radius: 1rem;
    box-shadow: 4px 4px 0 0 $color-text-dark;

    &::backdrop {
      background-color: rgba($color-text-dark, 0.5);
    }
  }
}
</style>
