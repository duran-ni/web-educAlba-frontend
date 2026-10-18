import { test, expect } from '@playwright/test'

const ADMIN_USER = {
  id: 1,
  email: 'admin@educalba.com',
  roles: ['ADMINISTRADOR'],
}

const STUDENT_A = {
  id: 7,
  firstName: 'Lucía',
  lastName: 'Gómez',
  age: 10,
  phone: '600111222',
  serviceOfInterest: 'Clases de Refuerzo',
  educationalStage: 'PRIMARIA',
  status: 'ACTIVE',
}

const STUDENT_B = {
  id: 8,
  firstName: 'Marcos',
  lastName: 'Ruiz',
  age: 11,
  phone: '600333444',
  serviceOfInterest: 'Clases de Refuerzo',
  educationalStage: 'ESO',
  status: 'ACTIVE',
}

async function mockAuth(page) {
  await page.route('**/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ADMIN_USER),
    })
  })
}

test.describe('Admin — Students', () => {
  test('creates a new student without a workshop', async ({ page }) => {
    await mockAuth(page)
    let studentsCall = 0
    await page.route('**/admin/students', (route) => {
      if (route.request().method() === 'GET') {
        studentsCall += 1
        const data =
          studentsCall === 1
            ? []
            : [
                {
                  id: 20,
                  firstName: 'Nora',
                  lastName: 'Pérez',
                  age: null,
                  phone: null,
                  serviceOfInterest: 'Clases de Refuerzo',
                  educationalStage: 'PRIMARIA',
                  status: 'ACTIVE',
                },
              ]
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 20,
          firstName: 'Nora',
          lastName: 'Pérez',
          age: null,
          phone: null,
          serviceOfInterest: 'Clases de Refuerzo',
          educationalStage: 'PRIMARIA',
          status: 'ACTIVE',
        }),
      })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    await page.route('**/public/workshops', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/admin/alumnos')
    await page.getByRole('button', { name: '+ Nuevo Alumno' }).click()
    await page.locator('#student-first-name').fill('Nora')
    await page.locator('#student-last-name').fill('Pérez')
    await page.locator('#student-stage').selectOption('PRIMARIA')
    await page.getByRole('button', { name: 'Guardar alumno' }).click()

    await expect(page.getByRole('row', { name: /Nora/ })).toBeVisible()
  })

  test('creates a new student and enrolls them in a workshop', async ({ page }) => {
    await mockAuth(page)

    let studentsCall = 0
    await page.route('**/admin/students', (route) => {
      if (route.request().method() === 'GET') {
        studentsCall += 1
        const data =
          studentsCall === 1
            ? []
            : [
                {
                  id: 20,
                  firstName: 'Nora',
                  lastName: 'Pérez',
                  age: null,
                  phone: null,
                  serviceOfInterest: 'Clases de Refuerzo',
                  educationalStage: 'PRIMARIA',
                  status: 'ACTIVE',
                },
              ]
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 20,
          firstName: 'Nora',
          lastName: 'Pérez',
          age: null,
          phone: null,
          serviceOfInterest: 'Clases de Refuerzo',
          educationalStage: 'PRIMARIA',
          status: 'ACTIVE',
        }),
      })
    })

    let enrollmentsCall = 0
    await page.route('**/admin/enrollments', (route) => {
      if (route.request().method() === 'GET') {
        enrollmentsCall += 1
        const data =
          enrollmentsCall === 1
            ? []
            : [{ id: 30, studentId: 20, workshopId: 8, workshopName: 'Taller de Teatro' }]
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) })
        return
      }

      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 30,
          studentId: 20,
          workshopId: 8,
          workshopName: 'Taller de Teatro',
        }),
      })
    })

    await page.route('**/public/workshops', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 8, name: 'Taller de Teatro' }]),
      })
    })

    await page.goto('/admin/alumnos')
    await page.getByRole('button', { name: '+ Nuevo Alumno' }).click()
    await page.locator('#student-first-name').fill('Nora')
    await page.locator('#student-last-name').fill('Pérez')
    await page.locator('#student-stage').selectOption('PRIMARIA')
    await page.getByLabel('Además, está apuntado a un taller').check()
    await page.locator('#student-workshop').selectOption('8')
    await page.getByRole('button', { name: 'Guardar alumno' }).click()

    const row = page.getByRole('row', { name: /Nora/ })
    await expect(row).toBeVisible()
    await expect(row).toContainText('Taller de Teatro')
  })

  test('filters students by name', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/students', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([STUDENT_A, STUDENT_B]),
      })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/admin/alumnos')
    await page.locator('#student-search').fill('Lucía')

    await expect(page.getByRole('row', { name: /Lucía/ })).toBeVisible()
    await expect(page.getByRole('row', { name: /Marcos/ })).not.toBeVisible()
  })

  test('edits an existing student', async ({ page }) => {
    await mockAuth(page)

    let studentsCall = 0
    await page.route('**/admin/students', (route) => {
      if (route.request().method() === 'GET') {
        studentsCall += 1
        const data = studentsCall === 1 ? [STUDENT_A] : [{ ...STUDENT_A, educationalStage: 'ESO' }]
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) })
        return
      }
    })
    await page.route('**/admin/students/7', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...STUDENT_A, educationalStage: 'ESO' }),
      })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    await page.goto('/admin/alumnos')
    await page.getByRole('button', { name: 'Editar a Lucía Gómez' }).click()
    await page.locator('#student-stage').selectOption('ESO')
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page.getByRole('row', { name: /Lucía/ })).toContainText('ESO')
  })

  test('deletes a student after confirming', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/students', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([STUDENT_A]),
      })
    })
    await page.route('**/admin/students/7', (route) => {
      route.fulfill({ status: 204 })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    page.once('dialog', (dialog) => dialog.accept())

    await page.goto('/admin/alumnos')
    await page.getByRole('button', { name: 'Eliminar a Lucía Gómez' }).click()

    await expect(page.getByText('No se han encontrado alumnos.')).toBeVisible()
  })

  test('keeps the student when the deletion is not confirmed', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/students', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([STUDENT_A]),
      })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })
    page.once('dialog', (dialog) => dialog.dismiss())

    await page.goto('/admin/alumnos')
    await page.getByRole('button', { name: 'Eliminar a Lucía Gómez' }).click()

    await expect(page.getByRole('row', { name: /Lucía/ })).toBeVisible()
  })

  test('shows an error when deleting a student that has workshop enrollments', async ({ page }) => {
    await mockAuth(page)
    await page.route('**/admin/students', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([STUDENT_A]),
      })
    })
    await page.route('**/admin/students/7', (route) => {
      route.fulfill({ status: 409 })
    })
    await page.route('**/admin/enrollments', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    })

    // Listener permanente, igual que en workshops.spec.js y gallery.spec.js:
    // evita la condición de carrera entre el confirm y el alert nativos
    const dialogMessages = []
    page.on('dialog', (dialog) => {
      dialogMessages.push(dialog.message())
      dialog.accept()
    })

    await page.goto('/admin/alumnos')
    await page.getByRole('button', { name: 'Eliminar a Lucía Gómez' }).click()

    await expect.poll(() => dialogMessages.length).toBe(2)
    expect(dialogMessages[1]).toContain('inscripciones a talleres')

    await expect(page.getByRole('row', { name: /Lucía/ })).toBeVisible()
  })
})
