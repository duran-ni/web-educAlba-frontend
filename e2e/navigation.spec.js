import { test, expect } from '@playwright/test'

test.describe('Router navigation', () => {
  test('shows the home view at "/"', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('EducAlba')).toBeVisible()
  })

  test('shows the login view at "/login"', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })

  test('redirects to login when accessing a protected route unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL('/login')
  })

  test('shows the 404 view for an unknown route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist')

    await expect(page.getByText('404')).toBeVisible()
  })
})
