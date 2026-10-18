import { test, expect } from '@playwright/test'

test.describe('Forgot password', () => {
  test('shows a success message after requesting a reset link', async ({ page }) => {
    await page.route('**/auth/forgot-password', (route) => {
      route.fulfill({ status: 204 })
    })

    await page.goto('/recuperar-contrasena')
    await page.getByPlaceholder('tu@email.com').fill('familia@educalba.com')
    await page.getByRole('button', { name: 'Enviar enlace de recuperación' }).click()

    await expect(page.getByRole('heading', { name: '¡Revisa tu correo!' })).toBeVisible()
  })

  test('validates the email field', async ({ page }) => {
    await page.goto('/recuperar-contrasena')

    await page.getByRole('button', { name: 'Enviar enlace de recuperación' }).click()
    await expect(page.getByText('Escribe tu email', { exact: true })).toBeVisible()

    await page.getByPlaceholder('tu@email.com').fill('no-es-un-email')
    await page.getByRole('button', { name: 'Enviar enlace de recuperación' }).click()
    await expect(page.getByText('Escribe un email válido')).toBeVisible()
  })
})

test.describe('Reset password', () => {
  test('resets the password successfully with a valid token', async ({ page }) => {
    await page.route('**/auth/reset-password', (route) => {
      route.fulfill({ status: 200 })
    })

    await page.goto('/restablecer-contrasena?token=valid-token-123')
    await page.locator('#reset-password-password').fill('nuevaContraseña123')
    await page.locator('#reset-password-confirm-password').fill('nuevaContraseña123')
    await page.getByRole('button', { name: 'Guardar nueva contraseña' }).click()

    await expect(page.getByRole('heading', { name: '¡Contraseña actualizada!' })).toBeVisible()
  })

  test('shows an invalid link message when the URL has no token', async ({ page }) => {
    await page.goto('/restablecer-contrasena')

    await expect(page.getByRole('heading', { name: 'Enlace no válido' })).toBeVisible()
    await expect(
      page.getByText('Este enlace no incluye un token de restablecimiento válido.')
    ).toBeVisible()
  })

  test('shows an invalid link message when the backend rejects the token', async ({ page }) => {
    await page.route('**/auth/reset-password', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Este enlace ha caducado.' }),
      })
    })

    await page.goto('/restablecer-contrasena?token=token-caducado')
    await page.locator('#reset-password-password').fill('nuevaContraseña123')
    await page.locator('#reset-password-confirm-password').fill('nuevaContraseña123')
    await page.getByRole('button', { name: 'Guardar nueva contraseña' }).click()

    await expect(page.getByRole('heading', { name: 'Enlace no válido' })).toBeVisible()
    await expect(page.getByText('Este enlace ha caducado.')).toBeVisible()
  })

  test('validates that both passwords match', async ({ page }) => {
    await page.goto('/restablecer-contrasena?token=valid-token-123')
    await page.locator('#reset-password-password').fill('nuevaContraseña123')
    await page.locator('#reset-password-confirm-password').fill('otra-distinta')
    await page.getByRole('button', { name: 'Guardar nueva contraseña' }).click()

    await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible()
  })
})
