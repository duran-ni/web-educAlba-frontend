import { test, expect } from '@playwright/test'

test.describe('Public — About (teachers)', () => {
  test('shows the list of published teachers', async ({ page }) => {
    await page.route('**/public/teachers', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Laura Gómez', specialty: 'Matemáticas' },
          { id: 2, name: 'Marcos Ruiz', specialty: 'Educación Física' },
        ]),
      })
    })

    await page.goto('/quienes-somos')

    await expect(page.getByText('Laura Gómez')).toBeVisible()
    await expect(page.getByText('Matemáticas')).toBeVisible()
    await expect(page.getByText('Marcos Ruiz')).toBeVisible()
  })

  test('shows a message when there are no published teachers', async ({ page }) => {
    await page.route('**/public/teachers', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/quienes-somos')

    await expect(page.getByText('Todavía no hay profesores publicados.')).toBeVisible()
  })

  test('shows an error message when teachers fail to load', async ({ page }) => {
    await page.route('**/public/teachers', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('/quienes-somos')

    await expect(
      page.getByText('No hemos podido cargar el equipo. Inténtalo de nuevo más tarde.')
    ).toBeVisible()
  })
})
