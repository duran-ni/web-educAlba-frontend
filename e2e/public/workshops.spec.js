import { test, expect } from '@playwright/test'

const WORKSHOP_A = {
  id: 8,
  name: 'Taller de Teatro',
  date: '2026-11-15',
}

async function mockWorkshops(page) {
  await page.route('**/public/workshops', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([WORKSHOP_A]) })
  })
}

test.describe('Public — Workshop enrollment', () => {
  test('enrolls in a workshop successfully', async ({ page }) => {
    await mockWorkshops(page)
    await page.route('**/public/enrollments', async (route) => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 1 }) })
    })

    await page.goto('/talleres')
    await page.locator('#enrollment-student-name').fill('Nora Pérez')
    await page.locator('#enrollment-age').fill('8')
    await page.locator('#enrollment-phone').fill('611222333')
    await page.getByRole('checkbox', { name: /Taller de Teatro/ }).check()
    await page.getByRole('button', { name: 'Enviar Inscripción' }).click()

    await expect(
      page.getByText('¡Gracias! Hemos recibido tu inscripción, te contactaremos pronto.')
    ).toBeVisible()
  })

  test('shows validation errors for empty required fields', async ({ page }) => {
    await mockWorkshops(page)

    await page.goto('/talleres')
    await page.getByRole('button', { name: 'Enviar Inscripción' }).click()

    await expect(page.getByText('Escribe el nombre del alumno/a')).toBeVisible()
    await expect(page.getByText('Escribe la edad')).toBeVisible()
    await expect(page.getByText('Escribe un teléfono de contacto')).toBeVisible()
    await expect(page.getByText('Selecciona al menos un taller')).toBeVisible()
  })

  test('shows a validation error for an invalid phone number', async ({ page }) => {
    await mockWorkshops(page)

    await page.goto('/talleres')
    await page.locator('#enrollment-student-name').fill('Nora Pérez')
    await page.locator('#enrollment-age').fill('8')
    await page.locator('#enrollment-phone').fill('12345')
    await page.getByRole('checkbox', { name: /Taller de Teatro/ }).check()
    await page.getByRole('button', { name: 'Enviar Inscripción' }).click()

    await expect(
      page.getByText('El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9')
    ).toBeVisible()
  })

  test('shows an error message when the enrollment submission fails', async ({ page }) => {
    await mockWorkshops(page)
    await page.route('**/public/enrollments', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('/talleres')
    await page.locator('#enrollment-student-name').fill('Nora Pérez')
    await page.locator('#enrollment-age').fill('8')
    await page.locator('#enrollment-phone').fill('611222333')
    await page.getByRole('checkbox', { name: /Taller de Teatro/ }).check()
    await page.getByRole('button', { name: 'Enviar Inscripción' }).click()

    await expect(
      page.getByText('No hemos podido registrar tu inscripción. Inténtalo de nuevo en unos minutos.')
    ).toBeVisible()
  })
})
