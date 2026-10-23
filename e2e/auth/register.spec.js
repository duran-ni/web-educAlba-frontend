import { test, expect } from '@playwright/test'

// Usuario simulado que "devolvería" el backend tras el login automático
// que se dispara justo después de un registro correcto
const NEW_FAMILY_USER = {
  id: 3,
  email: 'nueva-familia@educalba.com',
  roles: ['ALUMNO_FAMILIA'],
}

// Rellena los campos comunes a todos los tests de este archivo, dejando
// personalizables solo el email y las contraseñas
async function fillRegisterForm(page, { email, password, confirmPassword }) {
  await page.locator('#register-first-name').fill('Lucía')
  await page.locator('#register-last-name').fill('García López')
  await page.locator('#register-email').fill(email)
  await page.locator('#register-stage').selectOption('PRIMARIA')
  await page.locator('#register-service').selectOption('Talleres')
  await page.locator('#register-password').fill(password)
  await page.locator('#register-confirm-password').fill(confirmPassword)
  await page.locator('#register-privacy-consent').check()
}

test.describe('Register', () => {
  test('registers successfully and lands on the user dashboard', async ({ page }) => {
    await page.route('**/auth/register', (route) => {
      route.fulfill({ status: 201 })
    })
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(NEW_FAMILY_USER),
      })
    })

    await page.goto('/registro')
    await fillRegisterForm(page, {
      email: 'nueva-familia@educalba.com',
      password: 'contraseñaSegura123',
      confirmPassword: 'contraseñaSegura123',
    })
    await page.getByRole('button', { name: 'Crear mi libreta en EducAlba' }).click()

    await expect(page).toHaveURL('/dashboard')
  })

  test('shows an error when the email is already registered', async ({ page }) => {
    await page.route('**/auth/register', (route) => {
      route.fulfill({ status: 409 })
    })

    await page.goto('/registro')
    await fillRegisterForm(page, {
      email: 'ya-existe@educalba.com',
      password: 'contraseñaSegura123',
      confirmPassword: 'contraseñaSegura123',
    })
    await page.getByRole('button', { name: 'Crear mi libreta en EducAlba' }).click()

    await expect(
      page.getByText('Ya existe una cuenta registrada con ese email.')
    ).toBeVisible()
    await expect(page).toHaveURL('/registro')
  })

  test('blocks submission and shows validation messages for empty required fields', async ({
    page,
  }) => {
    await page.goto('/registro')
    await page.getByRole('button', { name: 'Crear mi libreta en EducAlba' }).click()

    await expect(page.getByText('Escribe el nombre del alumno/a')).toBeVisible()
    await expect(page.getByText('Escribe los apellidos')).toBeVisible()
    await expect(page.getByText('Escribe un email')).toBeVisible()
    await expect(page.getByText('Selecciona una etapa educativa')).toBeVisible()
    await expect(page.locator('#register-service-error')).toBeVisible()
    await expect(page.getByText('Escribe una contraseña')).toBeVisible()
    await expect(page.getByText('Confirma tu contraseña')).toBeVisible()
  })

  test('validates the minimum password length and that both passwords match', async ({
    page,
  }) => {
    await page.goto('/registro')
    await fillRegisterForm(page, {
      email: 'familia@educalba.com',
      password: '1234567',
      confirmPassword: 'otra-distinta',
    })
    await page.getByRole('button', { name: 'Crear mi libreta en EducAlba' }).click()

    await expect(
      page.getByText('La contraseña debe tener al menos 8 caracteres')
    ).toBeVisible()
    await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible()
  })
})
