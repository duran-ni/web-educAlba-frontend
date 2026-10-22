import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'

import AdminStudentsView from '../AdminStudentsView.vue'
import StudentForm from '@/components/student/StudentForm.vue'
import { fetchStudents, deleteStudent } from '@/services/students'
import { fetchEnrollments } from '@/services/enrollments'
import { fetchStudentMaterials } from '@/services/materials'

vi.mock('@/services/students', () => ({
  fetchStudents: vi.fn(),
  deleteStudent: vi.fn(),
}))

vi.mock('@/services/enrollments', () => ({
  fetchEnrollments: vi.fn(),
}))

vi.mock('@/services/materials', () => ({
  fetchStudentMaterials: vi.fn(),
  deleteStudentMaterial: vi.fn(),
}))

// jsdom no implementa el elemento <dialog>: se simulan sus dos únicos
// métodos que usa este componente
HTMLDialogElement.prototype.showModal = vi.fn()
HTMLDialogElement.prototype.close = vi.fn()

const STUDENT_LUCIA = {
  id: 1,
  firstName: 'Lucía',
  lastName: 'García López',
  status: 'ACTIVE',
  age: 9,
  phone: '600111222',
  serviceOfInterest: 'Refuerzo',
  educationalStage: 'PRIMARIA',
}
const STUDENT_MARCOS = {
  id: 2,
  firstName: 'Marcos',
  lastName: 'Pérez Ruiz',
  status: 'ACTIVE',
}
const STUDENT_PENDING = { id: 3, firstName: 'Ana', lastName: 'Soto', status: 'PENDING' }
const ENROLLMENT_LUCIA = { id: 10, studentId: 1, workshopId: 1, workshopName: 'Robótica' }

function mountView() {
  return shallowMount(AdminStudentsView)
}

async function mountLoaded(
  students = [STUDENT_LUCIA, STUDENT_MARCOS],
  enrollments = [ENROLLMENT_LUCIA],
  materials = []
) {
  fetchStudents.mockResolvedValueOnce({ data: students })
  fetchEnrollments.mockResolvedValueOnce({ data: enrollments })
  fetchStudentMaterials.mockResolvedValueOnce({ data: materials })
  const wrapper = mountView()
  await flushPromises()
  return wrapper
}

describe('AdminStudentsView.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the loading message before the students arrive', () => {
    fetchStudents.mockReturnValue(new Promise(() => {}))
    fetchEnrollments.mockReturnValue(new Promise(() => {}))
    fetchStudentMaterials.mockReturnValue(new Promise(() => {}))
    const wrapper = mountView()

    expect(wrapper.text()).toContain('Cargando alumnos…')
  })

  it('shows an error message when the request fails', async () => {
    fetchStudents.mockRejectedValueOnce(new Error('network error'))
    fetchEnrollments.mockResolvedValueOnce({ data: [] })
    fetchStudentMaterials.mockResolvedValueOnce({ data: [] })
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.text()).toContain(
      'No hemos podido cargar los alumnos. Inténtalo de nuevo más tarde.'
    )
  })

  it('shows only active students, with their workshops and a dash for missing fields', async () => {
    const wrapper = await mountLoaded([STUDENT_LUCIA, STUDENT_MARCOS, STUDENT_PENDING])

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Ana')

    const luciaCells = rows[0].findAll('td')
    expect(luciaCells.slice(0, 7).map((cell) => cell.text())).toEqual([
      'Lucía',
      'García López',
      '9',
      '600111222',
      'Refuerzo',
      'PRIMARIA',
      'Robótica',
    ])
    expect(rows[0].get('.admin-students-view__edit').text()).toBe('Editar')
    expect(rows[0].get('.admin-students-view__delete').text()).toBe('Eliminar')

    const marcosCells = rows[1].findAll('td')
    expect(marcosCells.slice(0, 7).map((cell) => cell.text())).toEqual([
      'Marcos',
      'Pérez Ruiz',
      '—',
      '—',
      '—',
      '—',
      '—',
    ])
  })

  it('shows an empty-state message when there are no active students at all', async () => {
    const wrapper = await mountLoaded([STUDENT_PENDING], [])

    expect(wrapper.text()).toContain('No se han encontrado alumnos.')
  })

  it('filters the visible students by name as the user types', async () => {
    const wrapper = await mountLoaded()

    await wrapper.get('#student-search').setValue('lucía')

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(1)
    expect(rows[0].text()).toContain('Lucía')
  })

  it('shows an empty-state message when the search does not match any student', async () => {
    const wrapper = await mountLoaded()

    await wrapper.get('#student-search').setValue('no existe nadie así')

    expect(wrapper.text()).toContain('No se han encontrado alumnos.')
  })

  it('opens the dialog with an empty form when "+ Nuevo Alumno" is clicked', async () => {
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-students-view__new-student').trigger('click')

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    expect(wrapper.findComponent(StudentForm).props('student')).toBeNull()
    expect(wrapper.findComponent(StudentForm).props('enrollment')).toBeNull()
  })

  it('opens the dialog with the selected student and their enrollment when "Editar" is clicked', async () => {
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-students-view__edit').trigger('click')

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    expect(wrapper.findComponent(StudentForm).props('student')).toEqual(STUDENT_LUCIA)
    expect(wrapper.findComponent(StudentForm).props('enrollment')).toEqual(ENROLLMENT_LUCIA)
  })

  it('opens the dialog with a null enrollment for a student with no workshop', async () => {
    const wrapper = await mountLoaded()

    await wrapper.findAll('.admin-students-view__edit')[1].trigger('click')

    expect(wrapper.findComponent(StudentForm).props('student')).toEqual(STUDENT_MARCOS)
    expect(wrapper.findComponent(StudentForm).props('enrollment')).toBeNull()
  })

  it('clears the editing student when the dialog fires its native close event', async () => {
    const wrapper = await mountLoaded()
    await wrapper.get('.admin-students-view__edit').trigger('click')
    expect(wrapper.findComponent(StudentForm).props('student')).toEqual(STUDENT_LUCIA)

    await wrapper.get('.admin-students-view__dialog').trigger('close')

    expect(wrapper.findComponent(StudentForm).props('student')).toBeNull()
  })

  it('reloads the student list and closes the dialog when StudentForm emits "created"', async () => {
    const wrapper = await mountLoaded()
    fetchStudents.mockResolvedValueOnce({ data: [STUDENT_LUCIA, STUDENT_MARCOS] })
    fetchEnrollments.mockResolvedValueOnce({ data: [ENROLLMENT_LUCIA] })
    fetchStudentMaterials.mockResolvedValueOnce({ data: [] })

    wrapper.findComponent(StudentForm).vm.$emit('created')
    await flushPromises()

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
    expect(fetchStudents).toHaveBeenCalledTimes(2)
  })

  it('reloads the student list and closes the dialog when StudentForm emits "updated"', async () => {
    const wrapper = await mountLoaded()
    fetchStudents.mockResolvedValueOnce({ data: [STUDENT_LUCIA, STUDENT_MARCOS] })
    fetchEnrollments.mockResolvedValueOnce({ data: [ENROLLMENT_LUCIA] })
    fetchStudentMaterials.mockResolvedValueOnce({ data: [] })

    wrapper.findComponent(StudentForm).vm.$emit('updated')
    await flushPromises()

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
    expect(fetchStudents).toHaveBeenCalledTimes(2)
  })

  it('closes the dialog when StudentForm emits "cancel"', async () => {
    const wrapper = await mountLoaded()

    wrapper.findComponent(StudentForm).vm.$emit('cancel')
    await flushPromises()

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
  })

  it('does nothing when the delete confirmation is cancelled', async () => {
    window.confirm.mockReturnValueOnce(false)
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-students-view__delete').trigger('click')
    await flushPromises()

    expect(deleteStudent).not.toHaveBeenCalled()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('removes the student from the list when the deletion is confirmed and succeeds', async () => {
    deleteStudent.mockResolvedValueOnce({})
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-students-view__delete').trigger('click')
    await flushPromises()

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar a "Lucía García López"? Esta acción no se puede deshacer.'
    )
    expect(deleteStudent).toHaveBeenCalledWith(STUDENT_LUCIA.id)
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('shows a specific alert when deleting a student with enrollments is rejected with 409', async () => {
    deleteStudent.mockRejectedValueOnce({ response: { status: 409 } })
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-students-view__delete').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se puede eliminar este alumno porque tiene inscripciones a talleres. Elimina antes sus inscripciones desde el panel de Talleres.'
    )
  })

  it('shows a generic alert when deleting a student fails for another reason', async () => {
    deleteStudent.mockRejectedValueOnce(new Error('network error'))
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-students-view__delete').trigger('click')
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se ha podido eliminar el alumno. Inténtalo de nuevo.'
    )
  })
})
