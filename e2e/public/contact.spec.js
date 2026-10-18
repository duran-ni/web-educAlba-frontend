import { test, expect } from '@playwright/test'

test.describe('Public — Contact form', () => {
  test('sends the contact form successfully', async ({ page }) => {
    await page.route('**/public/contact-messages', async (route) => {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 1 }) })
    })

    await page.goto('/contacto')
    await page.locator('#contact-name').fill('Profe María')
    await page.locator('#contact-email').fill('maria@ejemplo.com')
    await page.locator('#contact-subject').fill('Información sobre talleres')
    await page.locator('#contact-message').fill('Hola, me gustaría saber más sobre los talleres.')
    await page.getByRole('button', { name: 'Enviar Avión de Papel' }).click()

    await expect(
      page.getByText('¡Gracias por escribirnos! Te responderemos lo antes posible.')
    ).toBeVisible()
  })

  test('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/contacto')
    await page.getByRole('button', { name: 'Enviar Avión de Papel' }).click()

    await expect(page.getByText('Escribe tu nombre')).toBeVisible()
    await expect(page.getByText('Escribe tu email', { exact: true })).toBeVisible()
    await expect(page.getByText('Escribe un asunto')).toBeVisible()
    await expect(page.getByText('Escribe tu mensaje')).toBeVisible()
  })

  test('shows a validation error for an invalid email', async ({ page }) => {
    await page.goto('/contacto')
    await page.locator('#contact-name').fill('Profe María')
    await page.locator('#contact-email').fill('no-es-un-email')
    await page.locator('#contact-subject').fill('Información sobre talleres')
    await page.locator('#contact-message').fill('Hola, me gustaría saber más sobre los talleres.')
    await page.getByRole('button', { name: 'Enviar Avión de Papel' }).click()

    await expect(page.getByText('Escribe un email válido')).toBeVisible()
  })

  test('shows an error message when the submission fails', async ({ page }) => {
    await page.route('**/public/contact-messages', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('/contacto')
    await page.locator('#contact-name').fill('Profe María')
    await page.locator('#contact-email').fill('maria@ejemplo.com')
    await page.locator('#contact-subject').fill('Información sobre talleres')
    await page.locator('#contact-message').fill('Hola, me gustaría saber más sobre los talleres.')
    await page.getByRole('button', { name: 'Enviar Avión de Papel' }).click()

    await expect(
      page.getByText('No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.')
    ).toBeVisible()
  })

  test('prefills the subject from the URL query string', async ({ page }) => {
    await page.goto('/contacto?subject=Reserva%20una%20tutor%C3%ADa')

    await expect(page.locator('#contact-subject')).toHaveValue('Reserva una tutoría')
  })
})
