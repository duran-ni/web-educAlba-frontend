import { test, expect } from '@playwright/test'

const ADMIN_USER = {
  id: 1,
  email: 'admin@educalba.com',
  roles: ['ADMINISTRADOR'],
}

const WORKSHOP_A = {
  id: 5,
  name: 'Taller de Cerámica',
  description: 'Modelado y pintura con arcilla',
  date: '2026-11-10',
  time: '17:00',
  recommendedAge: '6-10',
  room: 'Sala A',
  active: true,
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
  await page.route('**/admin/teachers', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
  })
}

test.describe('Admin — Workshops', () => {
  test('creates a new workshop', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/workshops', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 10,
          name: 'Taller de Pintura',
          description: 'Acuarela y témpera',
          date: '2026-12-01',
          time: '18:00',
          recommendedAge: '4-8',
          room: 'Sala B',
          active: true,
        }),
      })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: '+ Nuevo Taller' }).click()
    await page.locator('#workshop-name').fill('Taller de Pintura')
    await page.locator('#workshop-date').fill('2026-12-01')
    await page.locator('#workshop-time').fill('18:00')
    await page.getByRole('button', { name: 'Guardar taller' }).click()

    await expect(page.getByText('Taller de Pintura')).toBeVisible()
  })

  test('edits an existing workshop', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([WORKSHOP_A]),
      })
    })
    await page.route('**/admin/workshops/5', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...WORKSHOP_A, room: 'Sala C' }),
      })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Editar' }).click()
    await page.locator('#workshop-room').fill('Sala C')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page.getByText('Sala C')).toBeVisible()
  })

  test('deletes a workshop after confirming', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([WORKSHOP_A]),
      })
    })
    await page.route('**/admin/workshops/5', (route) => {
      route.fulfill({ status: 204 })
    })
    page.once('dialog', (dialog) => dialog.accept())

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText('Taller de Cerámica')).not.toBeVisible()
    await expect(page.getByText('Todavía no hay talleres creados.')).toBeVisible()
  })

  test('keeps the workshop when the deletion is not confirmed', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([WORKSHOP_A]),
      })
    })
    page.once('dialog', (dialog) => dialog.dismiss())

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Eliminar' }).click()

    await expect(page.getByText('Taller de Cerámica')).toBeVisible()
  })

  test('shows an error when deleting a workshop that still has enrollments', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([WORKSHOP_A]),
      })
    })
    await page.route('**/admin/workshops/5', (route) => {
      route.fulfill({ status: 409 })
    })

    // Se registra un listener permanente, en vez de uno de "un solo uso" seguido
    // de waitForEvent: así se capturan los dos diálogos nativos (confirm y alert)
    // en el orden en que aparezcan, sin una ventana de tiempo en la que uno pueda
    // dispararse antes de que el test esté escuchando
    const dialogMessages = []
    page.on('dialog', (dialog) => {
      dialogMessages.push(dialog.message())
      dialog.accept()
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Eliminar' }).click()

    await expect.poll(() => dialogMessages.length).toBe(2)
    expect(dialogMessages[1]).toContain('tiene alumnos inscritos')

    await expect(page.getByText('Taller de Cerámica')).toBeVisible()
  })

  test('deactivates a workshop after confirming', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/admin/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([WORKSHOP_A]),
      })
    })
    await page.route('**/admin/workshops/5', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...WORKSHOP_A, active: false }),
      })
    })
    page.once('dialog', (dialog) => dialog.accept())

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Activo' }).click()

    await expect(page.getByRole('button', { name: 'Inactivo' })).toBeVisible()
  })

  test('deletes a student enrollment after confirming', async ({ page }) => {
    await mockAdminBasics(page)
    await page.route('**/admin/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([WORKSHOP_A]),
      })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 20, workshopId: 5, studentFullName: 'Nora Pérez' }]),
      })
    })
    await page.route('**/admin/enrollments/20', (route) => {
      route.fulfill({ status: 204 })
    })

    await page.goto('/admin')
    await page.getByRole('button', { name: 'Alumnos inscritos (1)' }).click()
    await expect(page.getByText('Nora Pérez')).toBeVisible()

    page.once('dialog', (dialog) => dialog.accept())
    await page.locator('.admin-workshops-list__enrollment-delete').click()

    await expect(page.getByText('Nora Pérez')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Alumnos inscritos (0)' })).toBeVisible()
  })
})
