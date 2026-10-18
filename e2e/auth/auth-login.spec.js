import { test, expect } from '@playwright/test'

// Usuario simulado que "devolvería" el backend tras un login correcto como administrador
const ADMIN_USER = {
  id: 1,
  email: 'admin@educalba.com',
  roles: ['ADMINISTRADOR'],
}

// Usuario simulado para el rol de familia/alumno
const FAMILY_USER = {
  id: 2,
  email: 'familia@educalba.com',
  roles: ['ALUMNO_FAMILIA'],
}

test.describe('Login', () => {
  test('logs in as an administrator and lands on the admin panel', async ({ page }) => {
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ADMIN_USER),
      })
    })

    await page.goto('/login')
    await page.getByPlaceholder('tu@email.com').fill('admin@educalba.com')
    await page.getByPlaceholder('••••••••').fill('password123')
    await page.getByRole('button', { name: 'Entrar a clase' }).click()

    await expect(page).toHaveURL('/admin')
    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible()
  })

  test('logs in as a family account and lands on the user dashboard', async ({ page }) => {
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(FAMILY_USER),
      })
    })

    await page.goto('/login')
    await page.getByPlaceholder('tu@email.com').fill('familia@educalba.com')
    await page.getByPlaceholder('••••••••').fill('password123')
    await page.getByRole('button', { name: 'Entrar a clase' }).click()

    await expect(page).toHaveURL('/dashboard')
  })

  test('shows an error message with incorrect credentials', async ({ page }) => {
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      })
    })

    await page.goto('/login')
    await page.getByPlaceholder('tu@email.com').fill('admin@educalba.com')
    await page.getByPlaceholder('••••••••').fill('wrong-password')
    await page.getByRole('button', { name: 'Entrar a clase' }).click()

    await expect(page.getByText('Usuario o contraseña incorrectos.')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('blocks submission and shows validation messages for empty fields', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Entrar a clase' }).click()

    await expect(page.getByText('Escribe tu usuario o email')).toBeVisible()
    await expect(page.getByText('Escribe tu contraseña')).toBeVisible()
  })
})

test.describe('Logout', () => {
  test('logs out and returns to the public home page', async ({ page }) => {
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ADMIN_USER),
      })
    })
    await page.route('**/auth/logout', (route) => {
      route.fulfill({ status: 200 })
    })

    await page.goto('/login')
    await page.getByPlaceholder('tu@email.com').fill('admin@educalba.com')
    await page.getByPlaceholder('••••••••').fill('password123')
    await page.getByRole('button', { name: 'Entrar a clase' }).click()
    await expect(page).toHaveURL('/admin')

    await page.getByRole('button', { name: 'Salir' }).click()

    await expect(page).toHaveURL('/')
  })
})

test.describe('Session persistence', () => {
  test('keeps the session when reloading a protected route', async ({ page }) => {
    // Simula que el navegador ya trae una cookie de sesión válida: cualquier
    // petición a /auth/me (la misma que usa checkSession al arrancar la app)
    // devuelve el usuario sin pedir credenciales
    await page.route('**/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ADMIN_USER),
      })
    })

    await page.goto('/admin')

    await expect(page).toHaveURL('/admin')
    await expect(page.getByRole('heading', { name: 'Panel de Administración' })).toBeVisible()
  })
})
