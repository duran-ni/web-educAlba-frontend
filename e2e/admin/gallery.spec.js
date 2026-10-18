import { test, expect } from '@playwright/test'

const ADMIN_USER = {
  id: 1,
  email: 'admin@educalba.com',
  roles: ['ADMINISTRADOR'],
}

const FOLDER_A = {
  id: 3,
  name: 'Taller de Robótica',
  photoCount: 1,
  coverPhotoId: 50,
}

const PHOTO_A = {
  id: 50,
  folderId: 3,
  caption: 'Clase de robótica',
  imageUrl: 'https://res.cloudinary.com/demo/robotica.jpg',
  mediaType: 'IMAGE',
}

async function mockAuth(page) {
  await page.route('**/auth/me', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ADMIN_USER) })
  })
}

test.describe('Admin — Gallery', () => {
  test('creates a new folder', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/gallery', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/gallery/folders', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 10, name: 'Taller de Pintura', photoCount: 0, coverPhotoId: null }),
      })
    })

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: '+ Nueva Carpeta' }).click()
    await page.locator('#gallery-folder-name').fill('Taller de Pintura')
    await page.getByRole('button', { name: 'Guardar carpeta' }).click()

    await expect(page.getByText('Taller de Pintura')).toBeVisible()
  })

  test('uploads a photo to a folder', async ({ page }) => {
    const folder = { id: 4, name: 'Taller de Pintura', photoCount: 0, coverPhotoId: null }
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([folder]) })
    })
    await page.route('**/admin/gallery', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 60,
          folderId: 4,
          caption: 'Acuarela y témpera',
          imageUrl: 'https://res.cloudinary.com/demo/acuarela.jpg',
          mediaType: 'IMAGE',
        }),
      })
    })

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Taller de Pintura' }).click()
    await page.getByRole('button', { name: 'Subir archivo' }).click()
    await page
      .locator('#gallery-photo-image')
      .setInputFiles({ name: 'acuarela.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-image') })
    await page.locator('#gallery-photo-caption').fill('Acuarela y témpera')
    await page.getByRole('dialog').getByRole('button', { name: 'Subir archivo' }).click()

    await expect(page.getByText('Acuarela y témpera')).toBeVisible()
  })

  test('shows an error but keeps the photos already uploaded when one upload in a batch fails', async ({
    page,
  }) => {
    const folder = { id: 4, name: 'Taller de Pintura', photoCount: 0, coverPhotoId: null }
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([folder]) })
    })

    let uploadCount = 0
    await page.route('**/admin/gallery', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      uploadCount += 1
      if (uploadCount === 1) {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 61,
            folderId: 4,
            caption: '',
            imageUrl: 'https://res.cloudinary.com/demo/una.jpg',
            mediaType: 'IMAGE',
          }),
        })
        return
      }

      route.fulfill({ status: 500 })
    })

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Taller de Pintura' }).click()
    await page.getByRole('button', { name: 'Subir archivo' }).click()
    await page.locator('#gallery-photo-image').setInputFiles([
      { name: 'una.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-image-1') },
      { name: 'dos.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-image-2') },
    ])
    await page.getByRole('button', { name: 'Subir archivos' }).click()

    await expect(
      page.getByText(
        'No hemos podido subir todos los archivos. Los que se subieron correctamente ya aparecen en la carpeta; vuelve a intentarlo con el resto.'
      )
    ).toBeVisible()
    await expect(page.locator('.admin-gallery-folder-detail__photo')).toHaveCount(1)
  })

  test('edits a photo caption', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([FOLDER_A]) })
    })
    await page.route('**/admin/gallery', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([PHOTO_A]) })
    })
    await page.route('**/admin/gallery/50', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...PHOTO_A, caption: 'Clase de robótica avanzada' }),
      })
    })

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Taller de Robótica' }).click()
    await page.getByRole('button', { name: 'Editar pie de foto' }).click()
    await page.locator('#gallery-photo-edit-caption').fill('Clase de robótica avanzada')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page.getByText('Clase de robótica avanzada')).toBeVisible()
  })

  test('sets a photo as the folder cover', async ({ page }) => {
    const folder = { id: 5, name: 'Taller de Música', photoCount: 2, coverPhotoId: 60 }
    const coverPhoto = {
      id: 60,
      folderId: 5,
      caption: 'Instrumentos',
      imageUrl: 'https://res.cloudinary.com/demo/instrumentos.jpg',
      mediaType: 'IMAGE',
    }
    const otherPhoto = {
      id: 61,
      folderId: 5,
      caption: 'Ensayo general',
      imageUrl: 'https://res.cloudinary.com/demo/ensayo.jpg',
      mediaType: 'IMAGE',
    }
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([folder]) })
    })
    await page.route('**/admin/gallery', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([coverPhoto, otherPhoto]),
      })
    })
    await page.route('**/admin/gallery/folders/5/cover', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...folder, coverPhotoId: 61 }),
      })
    })

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Taller de Música' }).click()
    await page.getByRole('button', { name: 'Marcar como portada' }).click()

    const updatedPhotoItem = page.locator('.admin-gallery-folder-detail__photo', {
      hasText: 'Ensayo general',
    })
    await expect(updatedPhotoItem.getByText('Portada')).toBeVisible()
  })

  test('deletes a photo after confirming', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([FOLDER_A]) })
    })
    await page.route('**/admin/gallery', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([PHOTO_A]) })
    })
    await page.route('**/admin/gallery/50', (route) => {
      route.fulfill({ status: 204 })
    })
    page.once('dialog', (dialog) => dialog.accept())

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Taller de Robótica' }).click()
    await page.getByRole('button', { name: 'Eliminar', exact: true }).click()

    await expect(page.getByText('Clase de robótica')).not.toBeVisible()
    await expect(page.getByText('Esta carpeta todavía no tiene fotos.')).toBeVisible()
  })

  test('deletes an empty folder after confirming', async ({ page }) => {
    const folder = { id: 6, name: 'Carpeta Vacía', photoCount: 0, coverPhotoId: null }
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([folder]) })
    })
    await page.route('**/admin/gallery', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/gallery/folders/6', (route) => {
      route.fulfill({ status: 204 })
    })
    page.once('dialog', (dialog) => dialog.accept())

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Carpeta Vacía' }).click()
    await page.getByRole('button', { name: 'Eliminar carpeta' }).click()

    await expect(page.getByText('Todavía no hay carpetas creadas.')).toBeVisible()
  })

  test('shows an error when deleting a folder that still has photos', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/gallery/folders', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([FOLDER_A]) })
    })
    await page.route('**/admin/gallery', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([PHOTO_A]) })
    })
    await page.route('**/admin/gallery/folders/3', (route) => {
      route.fulfill({ status: 409 })
    })

    // Listener permanente (ver el arreglo de WebKit en workshops.spec.js):
    // evita la condicion de carrera entre el confirm y el alert nativos
    const dialogMessages = []
    page.on('dialog', (dialog) => {
      dialogMessages.push(dialog.message())
      dialog.accept()
    })

    await page.goto('/admin/galeria')
    await page.getByRole('button', { name: 'Gestionar la carpeta Taller de Robótica' }).click()
    await page.getByRole('button', { name: 'Eliminar carpeta' }).click()

    await expect.poll(() => dialogMessages.length).toBe(2)
    expect(dialogMessages[1]).toContain('todavía tiene fotos')

    await expect(page.getByText('Taller de Robótica')).toBeVisible()
  })
})
