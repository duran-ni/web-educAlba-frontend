import { test, expect } from '@playwright/test'

const FOLDER_A = {
  id: 3,
  name: 'Taller de Robótica',
  photos: [{ id: 50, caption: 'Montaje de un robot', imageUrl: 'https://res.cloudinary.com/demo/robotica.jpg', mediaType: 'IMAGE' }],
}

const FOLDER_B = {
  id: 4,
  name: 'Taller de Pintura',
  photos: [{ id: 60, caption: 'Acuarela', imageUrl: 'https://res.cloudinary.com/demo/pintura.jpg', mediaType: 'IMAGE' }],
}

function mockGalleryPage(responsesByPage) {
  return async (route) => {
    const url = new URL(route.request().url())
    const pageParam = url.searchParams.get('page') ?? '0'
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responsesByPage[pageParam]),
    })
  }
}

test.describe('Public — Gallery', () => {
  test('shows folders with photos and loads more on click', async ({ page }) => {
    await page.route(
      '**/public/gallery?*',
      mockGalleryPage({
        0: { folders: [FOLDER_A], hasMore: true },
        1: { folders: [FOLDER_B], hasMore: false },
      })
    )

    await page.goto('/galeria')

    await expect(page.getByText('Taller de Robótica')).toBeVisible()
    await page.getByRole('button', { name: 'Cargar Más Recuerdos' }).click()

    await expect(page.getByText('Taller de Pintura')).toBeVisible()
  })

  test('shows an empty message when there are no folders with photos', async ({ page }) => {
    await page.route(
      '**/public/gallery?*',
      mockGalleryPage({
        0: { folders: [{ id: 5, name: 'Carpeta Vacía', photos: [] }], hasMore: false },
      })
    )

    await page.goto('/galeria')

    await expect(page.getByText('Todavía no hay fotos en la galería.')).toBeVisible()
  })

  test('shows an error message when the gallery fails to load', async ({ page }) => {
    await page.route('**/public/gallery?*', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('/galeria')

    await expect(
      page.getByText('No hemos podido cargar la galería. Inténtalo de nuevo más tarde.')
    ).toBeVisible()
  })

  test('navigates into a folder and loads more photos', async ({ page }) => {
    await page.route(
      '**/public/gallery?*',
      mockGalleryPage({
        0: { folders: [FOLDER_A], hasMore: false },
      })
    )
    await page.route(
      '**/public/gallery/3?*',
      mockGalleryPage({
        0: { id: 3, name: 'Taller de Robótica', photos: [FOLDER_A.photos[0]], hasMore: true },
        1: {
          id: 3,
          name: 'Taller de Robótica',
          photos: [{ id: 51, caption: 'Pintando la carcasa', imageUrl: 'https://res.cloudinary.com/demo/robotica2.jpg', mediaType: 'IMAGE' }],
          hasMore: false,
        },
      })
    )

    await page.goto('/galeria')
    await page.locator('.gallery-folder-card', { hasText: 'Taller de Robótica' }).click()

    await expect(page.getByAltText('Montaje de un robot')).toBeVisible()
    await page.getByRole('button', { name: 'Cargar Más Recuerdos' }).click()

    await expect(page.getByAltText('Pintando la carcasa')).toBeVisible()
  })
})
