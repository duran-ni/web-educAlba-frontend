import { test, expect } from '@playwright/test'

const ADMIN_USER = {
  id: 1,
  email: 'admin@educalba.com',
  roles: ['ADMINISTRADOR'],
}

// Respuestas comunes que necesita el Panel de Administración nada más
// cargar, independientemente de qué se vaya a probar en cada test
async function mockAdminBasics(page) {
  await page.route('**/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ADMIN_USER),
    })
  })
  await page.route('**/admin/dashboard/summary', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalEnrolledStudents: 0, totalActiveWorkshops: 0 }),
    })
  })
  await page.route('**/admin/workshops', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
  })
  await page.route('**/admin/enrollments', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
  })
}

test.describe('Admin — Teachers', () => {
  test('creates a new teacher without a photo', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/teachers', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 10, name: 'Marcos Ruiz', specialty: 'Educación Física' }),
      })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: '+ Nuevo Profesor' }).click()
    await page.locator('#teacher-name').fill('Marcos Ruiz')
    await page.locator('#teacher-specialty').fill('Educación Física')
    await page.getByRole('button', { name: 'Guardar profesor' }).click()

    await expect(page.getByText('Marcos Ruiz')).toBeVisible()
    await expect(page.getByText('Educación Física')).toBeVisible()
  })

  test('creates a new teacher with a photo', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/teachers', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 11, name: 'Laura Gómez', specialty: 'Matemáticas' }),
      })
    })
    await page.route('**/admin/teachers/11/photo', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 11,
          name: 'Laura Gómez',
          specialty: 'Matemáticas',
          photoUrl: 'https://res.cloudinary.com/demo/laura.jpg',
        }),
      })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: '+ Nuevo Profesor' }).click()
    await page.locator('#teacher-name').fill('Laura Gómez')
    await page.locator('#teacher-specialty').fill('Matemáticas')
    await page
      .locator('#teacher-photo')
      .setInputFiles({ name: 'laura.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-image') })
    await page.getByRole('button', { name: 'Guardar profesor' }).click()

    await expect(page.getByText('Laura Gómez')).toBeVisible()
  })

  test('shows a photo upload error but keeps the teacher saved', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/teachers', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 12, name: 'Ana Ruiz', specialty: 'Música' }),
      })
    })
    await page.route('**/admin/teachers/12/photo', (route) => {
      route.fulfill({ status: 502 })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: '+ Nuevo Profesor' }).click()
    await page.locator('#teacher-name').fill('Ana Ruiz')
    await page.locator('#teacher-specialty').fill('Música')
    await page
      .locator('#teacher-photo')
      .setInputFiles({ name: 'ana.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('fake-image') })
    await page.getByRole('button', { name: 'Guardar profesor' }).click()

    await expect(
      page.getByText('El profesor se ha guardado, pero no hemos podido subir la foto. Puedes volver a intentarlo editándolo de nuevo.')
    ).toBeVisible()
    await expect(page.getByText('Ana Ruiz')).toBeVisible()
  })

  test('edits an existing teacher', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/teachers', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 5, name: 'Laura Gómez', specialty: 'Matemáticas' }]),
      })
    })
    await page.route('**/admin/teachers/5', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 5, name: 'Laura Gómez', specialty: 'Física y Química' }),
      })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Editar' }).click()
    await page.locator('#teacher-specialty').fill('Física y Química')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page.getByText('Física y Química')).toBeVisible()
  })

  test('deletes a teacher after confirming', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/teachers', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 5, name: 'Laura Gómez', specialty: 'Matemáticas' }]),
      })
    })
    await page.route('**/admin/teachers/5', (route) => {
      route.fulfill({ status: 204 })
    })
    page.once('dialog', (dialog) => dialog.accept())

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText('Laura Gómez')).not.toBeVisible()
    await expect(page.getByText('Todavía no hay profesores creados.')).toBeVisible()
  })

  test('keeps the teacher when the deletion is not confirmed', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/teachers', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 5, name: 'Laura Gómez', specialty: 'Matemáticas' }]),
      })
    })
    page.once('dialog', (dialog) => dialog.dismiss())

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText('Laura Gómez')).toBeVisible()
  })
})
