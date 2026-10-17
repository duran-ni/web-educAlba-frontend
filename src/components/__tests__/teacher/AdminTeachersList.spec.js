import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import AdminTeachersList from '../../teacher/AdminTeachersList.vue'

const TEACHER = { id: 1, name: 'Laura Gómez', specialty: 'Matemáticas' }

function mountList({ status = 'loaded', teachers = [] } = {}) {
  return mount(AdminTeachersList, { props: { status, teachers } })
}

describe('AdminTeachersList.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
  })

  it('shows the loading message', () => {
    const wrapper = mountList({ status: 'loading' })

    expect(wrapper.text()).toContain('Cargando profesores…')
  })

  it('shows an error message', () => {
    const wrapper = mountList({ status: 'error' })

    expect(wrapper.text()).toContain(
      'No hemos podido cargar los profesores. Inténtalo de nuevo más tarde.'
    )
  })

  it('shows an empty-state message when there are no teachers', () => {
    const wrapper = mountList({ teachers: [] })

    expect(wrapper.text()).toContain('Todavía no hay profesores creados.')
  })

  it("renders a teacher's name and specialty", () => {
    const wrapper = mountList({ teachers: [TEACHER] })

    expect(wrapper.get('.admin-teachers-list__item-name').text()).toBe('Laura Gómez')
    expect(wrapper.get('.admin-teachers-list__item-specialty').text()).toBe('Matemáticas')
  })

  it('emits "edit" with the teacher when "Editar" is clicked', async () => {
    const wrapper = mountList({ teachers: [TEACHER] })

    await wrapper.get('.admin-teachers-list__edit').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[TEACHER]])
  })

  it('does nothing when the delete confirmation is cancelled', async () => {
    window.confirm.mockReturnValueOnce(false)
    const wrapper = mountList({ teachers: [TEACHER] })

    await wrapper.get('.admin-teachers-list__delete').trigger('click')

    expect(wrapper.emitted('delete')).toBeUndefined()
  })

  it('emits "delete" with the teacher id when the deletion is confirmed', async () => {
    const wrapper = mountList({ teachers: [TEACHER] })

    await wrapper.get('.admin-teachers-list__delete').trigger('click')

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar a "Laura Gómez"? Esta acción no se puede deshacer.'
    )
    expect(wrapper.emitted('delete')).toEqual([[TEACHER.id]])
  })
})
