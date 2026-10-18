import { test, expect } from '@playwright/test'

const ADMIN_USER = {
  id: 1,
  email: 'admin@educalba.com',
  roles: ['ADMINISTRADOR'],
}

const FAMILY_USER = {
  id: 2,
  email: 'familia@educalba.com',
  roles: ['ALUMNO_FAMILIA'],
}

test.describe('Role-based access', () => {
  test('redirects a family account away from the admin panel to its own dashboard', async ({
    page,
  }) => {
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(FAMILY_USER),
      })
    })

    await page.goto('/admin')

    await expect(page).toHaveURL('/dashboard')
  })

  test('redirects an administrator away from the user dashboard to the admin panel', async ({
    page,
  }) => {
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ADMIN_USER),
      })
    })

    await page.goto('/dashboard')

    await expect(page).toHaveURL('/admin')
    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible()
  })
})
