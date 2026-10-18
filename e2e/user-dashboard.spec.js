import { test, expect } from '@playwright/test'

const FAMILY_USER = {
  id: 2,
  email: 'familia@educalba.com',
  roles: ['ALUMNO_FAMILIA'],
}

async function mockAuth(page) {
  await page.route('**/auth/me', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAMILY_USER) })
  })
}

test.describe('User — Student dashboard', () => {
  test('shows the greeting with the student\'s first name', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/dashboard/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ firstName: 'Nora' }) })
    })
    await page.route('**/dashboard/my-workshops', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: '¡Hola, Nora!' })).toBeVisible()
  })

  test('shows the list of enrolled workshops', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/dashboard/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ firstName: 'Nora' }) })
    })
    await page.route('**/dashboard/my-workshops', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            enrollmentId: 1,
            workshopId: 8,
            workshopName: 'Taller de Teatro',
            date: '2026-11-15',
            time: '17:00',
            progress: 'En curso',
          },
        ]),
      })
    })

    await page.goto('/dashboard')

    await expect(page.getByText('Taller de Teatro')).toBeVisible()
    await expect(page.getByText('En curso')).toBeVisible()
  })

  test('shows a message with a link to Workshops when there are no enrolled workshops', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/dashboard/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ firstName: 'Nora' }) })
    })
    await page.route('**/dashboard/my-workshops', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/public/workshops', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/dashboard')

    await expect(page.getByText('¡No estás apuntado a ningún taller!')).toBeVisible()
    await page.getByRole('main').getByRole('link', { name: 'Talleres' }).click()

    await expect(page).toHaveURL(/\/talleres$/)
  })

  test('shows an error message when the profile fails to load', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/dashboard/me', async (route) => {
      await route.fulfill({ status: 500 })
    })
    await page.route('**/dashboard/my-workshops', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/dashboard')

    await expect(page.getByText('No hemos podido cargar tus datos. Inténtalo de nuevo más tarde.')).toBeVisible()
  })

  test('shows an error message when the workshops fail to load', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/dashboard/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ firstName: 'Nora' }) })
    })
    await page.route('**/dashboard/my-workshops', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('/dashboard')

    await expect(
      page.getByText('No hemos podido cargar tus talleres. Inténtalo de nuevo más tarde.')
    ).toBeVisible()
  })
})
