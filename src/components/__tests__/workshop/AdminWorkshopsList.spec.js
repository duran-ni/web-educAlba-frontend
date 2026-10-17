import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import AdminWorkshopsList from '../../workshop/AdminWorkshopsList.vue'

const WORKSHOP_FULL = {
  id: 1,
  name: 'Robótica',
  date: '2026-10-24',
  time: '17:00:00',
  active: true,
  recommendedAge: '8-12 años',
  room: 'Aula 3',
  description: 'Construye tu propio robot.',
}
const WORKSHOP_MINIMAL = {
  id: 2,
  name: 'Pintura',
  date: '2026-10-20',
  time: '18:00:00',
  active: false,
}
const ENROLLMENT = { id: 100, workshopId: 1, studentFullName: 'Lucía García López' }

function mountList({ status = 'loaded', workshops = [], enrollments = [] } = {}) {
  return mount(AdminWorkshopsList, { props: { status, workshops, enrollments } })
}

describe('AdminWorkshopsList.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
  })

  it('shows the loading message', () => {
    const wrapper = mountList({ status: 'loading' })

    expect(wrapper.text()).toContain('Cargando talleres…')
  })

  it('shows an error message', () => {
    const wrapper = mountList({ status: 'error' })

    expect(wrapper.text()).toContain('No hemos podido cargar los talleres. Inténtalo de nuevo más tarde.')
  })

  it('shows an empty-state message when there are no workshops', () => {
    const wrapper = mountList({ workshops: [] })

    expect(wrapper.text()).toContain('Todavía no hay talleres creados.')
  })

  it("renders a workshop's name, date, time and optional fields only when present", () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL, WORKSHOP_MINIMAL] })
    const items = wrapper.findAll('.admin-workshops-list__item')

    expect(items[0].text()).toContain('Robótica')
    expect(items[0].text()).toContain('sábado, 24 de octubre')
    expect(items[0].text()).toContain('17:00 h')
    expect(items[0].text()).toContain('8-12 años')
    expect(items[0].text()).toContain('Aula 3')
    expect(items[0].text()).toContain('Construye tu propio robot.')
    expect(items[0].get('.admin-workshops-list__status').text()).toBe('Activo')

    expect(items[1].find('.admin-workshops-list__item-age').exists()).toBe(false)
    expect(items[1].find('.admin-workshops-list__item-description').exists()).toBe(false)
    expect(items[1].get('.admin-workshops-list__status').text()).toBe('Inactivo')
  })

  it('shows the enrollments count badge and toggles the list open and closed', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL], enrollments: [ENROLLMENT] })
    const toggle = wrapper.get('.admin-workshops-list__enrollments-toggle')

    expect(toggle.text()).toBe('Alumnos inscritos (1)')
    expect(wrapper.find('.admin-workshops-list__enrollments').exists()).toBe(false)

    await toggle.trigger('click')
    expect(wrapper.find('.admin-workshops-list__enrollments').exists()).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(wrapper.find('.admin-workshops-list__enrollments').exists()).toBe(false)
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('shows an empty-enrollments message when the list is expanded with no enrollments', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL], enrollments: [] })

    await wrapper.get('.admin-workshops-list__enrollments-toggle').trigger('click')

    expect(wrapper.text()).toContain('Todavía no hay alumnos inscritos en este taller.')
  })

  it('lists each enrolled student when the list is expanded', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL], enrollments: [ENROLLMENT] })

    await wrapper.get('.admin-workshops-list__enrollments-toggle').trigger('click')

    expect(wrapper.get('.admin-workshops-list__enrollment-name').text()).toBe('Lucía García López')
  })

  it('emits "edit" with the workshop when "Editar" is clicked', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL] })

    await wrapper.get('.admin-workshops-list__edit').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[WORKSHOP_FULL]])
  })

  it('emits "create" when "+ Nuevo Taller" is clicked', async () => {
    const wrapper = mountList({ workshops: [], enrollments: [] }) // ajusta los props según tu mountList real

    await wrapper.get('.admin-workshops-list__new').trigger('click')

    expect(wrapper.emitted('create')).toHaveLength(1)
  })

  it('does nothing when the delete confirmation is cancelled', async () => {
    window.confirm.mockReturnValueOnce(false)
    const wrapper = mountList({ workshops: [WORKSHOP_FULL] })

    await wrapper.get('.admin-workshops-list__delete').trigger('click')

    expect(wrapper.emitted('delete')).toBeUndefined()
  })

  it('emits "delete" with the workshop id when the deletion is confirmed', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL] })

    await wrapper.get('.admin-workshops-list__delete').trigger('click')

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar el taller "Robótica"? Esta acción no se puede deshacer.',
    )
    expect(wrapper.emitted('delete')).toEqual([[WORKSHOP_FULL.id]])
  })

  it('asks for confirmation before deactivating an active workshop, and does nothing if cancelled', async () => {
    window.confirm.mockReturnValueOnce(false)
    const wrapper = mountList({ workshops: [WORKSHOP_FULL] })

    await wrapper.get('.admin-workshops-list__status').trigger('click')

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres desactivar el taller "Robótica"? Dejará de mostrarse en la web pública.',
    )
    expect(wrapper.emitted('toggle-active')).toBeUndefined()
  })

  it('emits "toggle-active" once deactivating an active workshop is confirmed', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_FULL] })

    await wrapper.get('.admin-workshops-list__status').trigger('click')

    expect(wrapper.emitted('toggle-active')).toEqual([[WORKSHOP_FULL]])
  })

  it('emits "toggle-active" immediately when activating an inactive workshop, without asking for confirmation', async () => {
    const wrapper = mountList({ workshops: [WORKSHOP_MINIMAL] })

    await wrapper.get('.admin-workshops-list__status').trigger('click')

    expect(window.confirm).not.toHaveBeenCalled()
    expect(wrapper.emitted('toggle-active')).toEqual([[WORKSHOP_MINIMAL]])
  })

  it('does nothing when the enrollment-deletion confirmation is cancelled, and emits "delete-enrollment" when confirmed', async () => {
    window.confirm.mockReturnValueOnce(false)
    const wrapper = mountList({ workshops: [WORKSHOP_FULL], enrollments: [ENROLLMENT] })
    await wrapper.get('.admin-workshops-list__enrollments-toggle').trigger('click')

    await wrapper.get('.admin-workshops-list__enrollment-delete').trigger('click')
    expect(wrapper.emitted('delete-enrollment')).toBeUndefined()

    await wrapper.get('.admin-workshops-list__enrollment-delete').trigger('click')
    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar la inscripción de "Lucía García López"? Esta acción no se puede deshacer.',
    )
    expect(wrapper.emitted('delete-enrollment')).toEqual([[ENROLLMENT.id]])
  })
})
