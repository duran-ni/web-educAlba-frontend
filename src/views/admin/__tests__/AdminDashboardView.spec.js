import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'

import AdminDashboardView from '../AdminDashboardView.vue'
import AdminWorkshopsList from '@/components/workshop/AdminWorkshopsList.vue'
import WorkshopForm from '@/components/workshop/WorkshopForm.vue'
import { fetchDashboardSummary } from '@/services/dashboard'
import { fetchAdminWorkshops, deleteWorkshop, updateWorkshop } from '@/services/workshops'
import { fetchEnrollments, deleteEnrollment } from '@/services/enrollments'

vi.mock('@/services/dashboard', () => ({
  fetchDashboardSummary: vi.fn(),
}))

vi.mock('@/services/workshops', () => ({
  fetchAdminWorkshops: vi.fn(),
  deleteWorkshop: vi.fn(),
  updateWorkshop: vi.fn(),
}))

vi.mock('@/services/enrollments', () => ({
  fetchEnrollments: vi.fn(),
  deleteEnrollment: vi.fn(),
}))

// El stream SSE en tiempo real no tiene sentido en un entorno de test (jsdom
// no implementa EventSource de verdad); se simula como una función vacía,
// ya que la recarga manual del resumen ya se cubre en cada test por separado
vi.mock('@/composables/useDashboardSummaryStream', () => ({
  useDashboardSummaryStream: vi.fn(),
}))

// jsdom no implementa el elemento <dialog>: se simulan sus dos únicos
// métodos que usa este componente
HTMLDialogElement.prototype.showModal = vi.fn()
HTMLDialogElement.prototype.close = vi.fn()

const WORKSHOP_A = { id: 1, name: 'Robótica', date: '2026-10-24', time: '17:00', active: true }
const WORKSHOP_B = { id: 2, name: 'Pintura', date: '2026-10-20', time: '18:00', active: true }

function mountView() {
  return shallowMount(AdminDashboardView)
}

async function mountLoaded() {
  fetchDashboardSummary.mockResolvedValueOnce({
    data: { totalEnrolledStudents: 12, totalActiveWorkshops: 3 },
  })
  fetchAdminWorkshops.mockResolvedValueOnce({ data: [WORKSHOP_B, WORKSHOP_A] })
  fetchEnrollments.mockResolvedValueOnce({ data: [] })
  const wrapper = mountView()
  await flushPromises()
  return wrapper
}

describe('AdminDashboardView.vue', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the loading message before the KPIs arrive', () => {
    fetchDashboardSummary.mockReturnValue(new Promise(() => {}))
    fetchAdminWorkshops.mockReturnValue(new Promise(() => {}))
    fetchEnrollments.mockReturnValue(new Promise(() => {}))
    const wrapper = mountView()

    expect(wrapper.text()).toContain('Cargando indicadores…')
  })

  it('shows the KPI values once the summary loads', async () => {
    const wrapper = await mountLoaded()

    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('Alumnos inscritos')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('Talleres activos')
  })

  it('shows an error message when the summary request fails', async () => {
    fetchDashboardSummary.mockRejectedValueOnce(new Error('network error'))
    fetchAdminWorkshops.mockResolvedValueOnce({ data: [] })
    fetchEnrollments.mockResolvedValueOnce({ data: [] })
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.text()).toContain(
      'No hemos podido cargar los indicadores. Inténtalo de nuevo más tarde.'
    )
  })

  it('opens the dialog with an empty form when "+ Nuevo Taller" is clicked', async () => {
    const wrapper = await mountLoaded()

    await wrapper.get('.admin-dashboard-view__new-workshop').trigger('click')

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    expect(wrapper.findComponent(WorkshopForm).props('workshop')).toBeNull()
  })

  it('opens the dialog with the selected workshop when AdminWorkshopsList emits "edit"', async () => {
    const wrapper = await mountLoaded()

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('edit', WORKSHOP_A)
    await flushPromises()

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
    expect(wrapper.findComponent(WorkshopForm).props('workshop')).toEqual(WORKSHOP_A)
  })

  it('closes the dialog when WorkshopForm emits "cancel"', async () => {
    const wrapper = await mountLoaded()

    wrapper.findComponent(WorkshopForm).vm.$emit('cancel')
    await flushPromises()

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
  })

  it('clears the editing workshop when the dialog fires its native close event', async () => {
    const wrapper = await mountLoaded()
    wrapper.findComponent(AdminWorkshopsList).vm.$emit('edit', WORKSHOP_A)
    await flushPromises()
    expect(wrapper.findComponent(WorkshopForm).props('workshop')).toEqual(WORKSHOP_A)

    await wrapper.get('.admin-dashboard-view__dialog').trigger('close')

    expect(wrapper.findComponent(WorkshopForm).props('workshop')).toBeNull()
  })

  it('inserts and sorts a newly created workshop, then closes the dialog and refreshes the summary', async () => {
    const wrapper = await mountLoaded()
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 4 },
    })
    const newWorkshop = { id: 3, name: 'Teatro', date: '2026-10-18', time: '16:00', active: true }

    wrapper.findComponent(WorkshopForm).vm.$emit('created', newWorkshop)
    await flushPromises()

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
    expect(
      wrapper
        .findComponent(AdminWorkshopsList)
        .props('workshops')
        .map((workshop) => workshop.id)
    ).toEqual([3, 2, 1])
    expect(fetchDashboardSummary).toHaveBeenCalledTimes(2)
  })

  it('replaces and sorts an updated workshop, then closes the dialog and refreshes the summary', async () => {
    const wrapper = await mountLoaded()
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 3 },
    })
    const updatedWorkshop = { ...WORKSHOP_A, date: '2026-10-15' }

    wrapper.findComponent(WorkshopForm).vm.$emit('updated', updatedWorkshop)
    await flushPromises()

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
    expect(
      wrapper
        .findComponent(AdminWorkshopsList)
        .props('workshops')
        .map((workshop) => workshop.id)
    ).toEqual([1, 2])
    expect(fetchDashboardSummary).toHaveBeenCalledTimes(2)
  })

  it('sorts by time when the newly created workshop shares its date with an existing one', async () => {
    const wrapper = await mountLoaded()
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 4 },
    })
    const sameDayWorkshop = {
      id: 3,
      name: 'Teatro',
      date: '2026-10-24',
      time: '09:00',
      active: true,
    }

    wrapper.findComponent(WorkshopForm).vm.$emit('created', sameDayWorkshop)
    await flushPromises()

    expect(
      wrapper
        .findComponent(AdminWorkshopsList)
        .props('workshops')
        .map((workshop) => workshop.id)
    ).toEqual([2, 3, 1])
  })

  it('sorts by time when the updated workshop shares its date with another workshop', async () => {
    const wrapper = await mountLoaded()
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 3 },
    })
    const updatedWorkshop = { ...WORKSHOP_A, date: '2026-10-20', time: '08:00' }

    wrapper.findComponent(WorkshopForm).vm.$emit('updated', updatedWorkshop)
    await flushPromises()

    expect(
      wrapper
        .findComponent(AdminWorkshopsList)
        .props('workshops')
        .map((workshop) => workshop.id)
    ).toEqual([1, 2])
  })

  it('removes a workshop and refreshes the summary when AdminWorkshopsList emits "delete"', async () => {
    deleteWorkshop.mockResolvedValueOnce({})
    const wrapper = await mountLoaded()
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 2 },
    })

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('delete', WORKSHOP_A.id)
    await flushPromises()

    expect(deleteWorkshop).toHaveBeenCalledWith(WORKSHOP_A.id)
    expect(
      wrapper
        .findComponent(AdminWorkshopsList)
        .props('workshops')
        .map((workshop) => workshop.id)
    ).toEqual([2])
    expect(fetchDashboardSummary).toHaveBeenCalledTimes(2)
  })

  it('shows a specific alert when deleting a workshop with enrollments is rejected with 409', async () => {
    deleteWorkshop.mockRejectedValueOnce({ response: { status: 409 } })
    const wrapper = await mountLoaded()

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('delete', WORKSHOP_A.id)
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se puede eliminar este taller porque tiene alumnos inscritos. Desactívalo en su lugar.'
    )
  })

  it('shows a generic alert when deleting a workshop fails for another reason', async () => {
    deleteWorkshop.mockRejectedValueOnce(new Error('network error'))
    const wrapper = await mountLoaded()

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('delete', WORKSHOP_A.id)
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se ha podido eliminar el taller. Inténtalo de nuevo.'
    )
  })

  it('updates a workshop\'s active state when AdminWorkshopsList emits "toggle-active"', async () => {
    const wrapper = await mountLoaded()
    const toggled = { ...WORKSHOP_A, active: false }
    updateWorkshop.mockResolvedValueOnce({ data: toggled })
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 2 },
    })

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('toggle-active', WORKSHOP_A)
    await flushPromises()

    expect(updateWorkshop).toHaveBeenCalledWith(WORKSHOP_A.id, { ...WORKSHOP_A, active: false })
    const updated = wrapper
      .findComponent(AdminWorkshopsList)
      .props('workshops')
      .find((workshop) => workshop.id === WORKSHOP_A.id)
    expect(updated.active).toBe(false)
  })

  it("shows an alert when toggling a workshop's active state fails", async () => {
    updateWorkshop.mockRejectedValueOnce(new Error('network error'))
    const wrapper = await mountLoaded()

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('toggle-active', WORKSHOP_A)
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se ha podido cambiar el estado del taller. Inténtalo de nuevo.'
    )
  })

  it('removes an enrollment and refreshes the summary when AdminWorkshopsList emits "delete-enrollment"', async () => {
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 3 },
    })
    fetchAdminWorkshops.mockResolvedValueOnce({ data: [WORKSHOP_B, WORKSHOP_A] })
    fetchEnrollments.mockResolvedValueOnce({
      data: [{ id: 99, workshopId: WORKSHOP_A.id, studentFullName: 'Lucía García López' }],
    })
    const wrapper = mountView()
    await flushPromises()

    deleteEnrollment.mockResolvedValueOnce({})
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 11, totalActiveWorkshops: 3 },
    })

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('delete-enrollment', 99)
    await flushPromises()

    expect(deleteEnrollment).toHaveBeenCalledWith(99)
    expect(wrapper.findComponent(AdminWorkshopsList).props('enrollments')).toEqual([])
    expect(fetchDashboardSummary).toHaveBeenCalledTimes(2)
  })

  it('shows an alert when deleting an enrollment fails', async () => {
    deleteEnrollment.mockRejectedValueOnce(new Error('network error'))
    const wrapper = await mountLoaded()

    wrapper.findComponent(AdminWorkshopsList).vm.$emit('delete-enrollment', 99)
    await flushPromises()

    expect(window.alert).toHaveBeenCalledWith(
      'No se ha podido eliminar la inscripción. Inténtalo de nuevo.'
    )
  })

  it('passes the error status to AdminWorkshopsList when the workshops request fails', async () => {
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 0, totalActiveWorkshops: 0 },
    })
    fetchAdminWorkshops.mockRejectedValueOnce(new Error('network error'))
    fetchEnrollments.mockResolvedValueOnce({ data: [] })

    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.findComponent(AdminWorkshopsList).props('status')).toBe('error')
  })

  it('does not break the rest of the view when the enrollments request fails', async () => {
    fetchDashboardSummary.mockResolvedValueOnce({
      data: { totalEnrolledStudents: 12, totalActiveWorkshops: 3 },
    })
    fetchAdminWorkshops.mockResolvedValueOnce({ data: [WORKSHOP_A] })
    fetchEnrollments.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.findComponent(AdminWorkshopsList).props('workshops')).toEqual([WORKSHOP_A])
    expect(wrapper.findComponent(AdminWorkshopsList).props('enrollments')).toEqual([])
  })
})
