import { test, expect } from '@playwright/test'

// Verifica que la app carga correctamente y muestra el contenido esperado
test('homepage displays the app title', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('EducAlba')).toBeVisible()
})
