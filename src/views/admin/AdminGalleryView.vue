<template>
  <section class="admin-gallery-view">
    <div class="admin-gallery-view__header">
      <button type="button" class="admin-gallery-view__new-folder" @click="openFolderDialog">
        <span class="material-symbols-outlined" aria-hidden="true">create_new_folder</span>
        + Nueva Carpeta
      </button>
    </div>

    <AdminGalleryFolderList
      :status="status"
      :folders="folders"
      :photos="photos"
      @delete-folder="handleDeleteFolder"
      @upload-photo="openPhotoDialog"
      @set-cover="handleSetCover"
      @delete-photo="handleDeletePhoto"
    />

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
        @uploaded="handlePhotoUploaded"
        @cancel="closePhotoDialog"
      />
    </dialog>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  fetchAdminGalleryFolders,
  fetchAdminGalleryPhotos,
  setGalleryFolderCover,
  deleteGalleryFolder,
  deleteGalleryPhoto,
} from '@/services/gallery'
import AdminGalleryFolderList from '@/components/gallery/AdminGalleryFolderList.vue'
import GalleryFolderForm from '@/components/gallery/GalleryFolderForm.vue'
import GalleryPhotoUploadForm from '@/components/gallery/GalleryPhotoUploadForm.vue'

// loading | loaded | error
const status = ref('loading')
const folders = ref([])
const photos = ref([])

const folderDialogRef = ref(null)
const photoDialogRef = ref(null)

// Carpeta sobre la que se esta subiendo una foto ahora mismo (null cuando
// el dialog de subida esta cerrado)
const uploadTargetFolder = ref(null)

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

// Se añade la foto recien subida a la lista y se incrementa el contador de
// fotos de su carpeta, sin volver a pedir nada al backend
function handlePhotoUploaded(newPhoto) {
  photos.value = [...photos.value, newPhoto]
  folders.value = folders.value.map((folder) =>
    folder.id === newPhoto.folderId ? { ...folder, photoCount: folder.photoCount + 1 } : folder
  )
  closePhotoDialog()
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
// quita tambien del listado en memoria
async function handleDeleteFolder(folderId) {
  try {
    await deleteGalleryFolder(folderId)
    folders.value = folders.value.filter((folder) => folder.id !== folderId)
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
