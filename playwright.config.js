// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Ejecuta los tests en paralelo dentro de cada archivo */
  fullyParallel: true,
  /* Falla el build en CI si accidentalmente se deja un test.only en el código */
  forbidOnly: !!process.env.CI,
  /* Reintenta solo en entornos de CI */
  retries: process.env.CI ? 2 : 0,
  /* Desactiva la ejecución en paralelo en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter a usar. Ver https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Configuración compartida por todos los proyectos definidos abajo. Ver https://playwright.dev/docs/api/class-testoptions */
  use: {
    /* URL base a usar en acciones como `await page.goto('/')` */
    baseURL: 'http://localhost:5173',

    /* Recoge la traza al reintentar un test fallido. Ver https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configura los proyectos para los navegadores principales */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Arranca el servidor de desarrollo local antes de ejecutar los tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
