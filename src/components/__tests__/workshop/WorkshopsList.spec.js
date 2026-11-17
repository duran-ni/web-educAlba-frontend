import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import WorkshopsList from '../../workshop/WorkshopsList.vue'
import { fetchWorkshops } from '@/services/workshops'
import { fetchMyWorkshops } from '@/services/dashboard'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

vi.mock('@/services/dashboard', () => ({
  fetchMyWorkshops: vi.fn(),
}))

const workshop = {
  id: 1,
  name: 'Manos a la obra',
  description: 'Un taller sensorial pensado para los más pequeños.',
  date: '2026-10-24',
  time: '11:00:00',
  recommendedAge: '1-2 años',
  room: null,
  active: true,
}

function mountList() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return {
    wrapper: mount(WorkshopsList, { global: { plugins: [pinia] } }),
    store: useAuthStore(),
  }
}

describe('WorkshopsList.vue', () => {
  beforeEach(() => {
    fetchMyWorkshops.mockResolvedValue({ data: [] })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading message while the workshops are being fetched', () => {
    fetchWorkshops.mockReturnValueOnce(new Promise(() => {}))

    const { wrapper } = mountList()

    expect(wrapper.text()).toContain('Cargando talleres…')
  })

  it('shows a card for each active workshop once they are loaded', async () => {
    fetchWorkshops.mockResolvedValueOnce({
      status: 200,
      data: [
        workshop,
        {
          id: 2,
          name: 'Cuentacuentos',
          description: 'Historias para despertar la imaginación.',
          date: '2026-11-02',
          time: '17:30:00',
          recommendedAge: '3-5 años',
          room: null,
          active: true,
        },
      ],
    })

    const { wrapper } = mountList()
    await flushPromises()

    expect(wrapper.text()).toContain('Manos a la obra')
    expect(wrapper.text()).toContain('Cuentacuentos')
  })

  it('shows an empty state when there are no active workshops', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [] })

    const { wrapper } = mountList()
    await flushPromises()

    expect(wrapper.text()).toContain('No hay talleres activos actualmente.')
  })

  it('shows an error message when the request fails', async () => {
    fetchWorkshops.mockRejectedValueOnce(new Error('network error'))

    const { wrapper } = mountList()
    await flushPromises()

    expect(wrapper.text()).toContain('No hemos podido cargar los talleres. Inténtalo de nuevo más tarde.')
  })

  it('does not request the enrolled workshops for an anonymous visitor', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [workshop] })

    mountList()
    await flushPromises()

    expect(fetchMyWorkshops).not.toHaveBeenCalled()
  })

  it('does not show the "Apuntarme" button for an anonymous visitor', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [workshop] })

    const { wrapper } = mountList()
    await flushPromises()

    expect(wrapper.find('.workshop-card__enroll-button').exists()).toBe(false)
  })

  it('shows the "Apuntarme" button for a logged in family user not yet enrolled', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [workshop] })

    const { wrapper, store } = mountList()
    store.user = { email: 'familia@example.com', roles: ['ALUMNO_FAMILIA'] }
    await flushPromises()

    expect(fetchMyWorkshops).toHaveBeenCalled()
    expect(wrapper.find('.workshop-card__enroll-button').exists()).toBe(true)
  })

  it('shows the enrolled badge instead of the button when already enrolled', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [workshop] })
    fetchMyWorkshops.mockResolvedValueOnce({ data: [{ workshopId: 1 }] })

    const { wrapper, store } = mountList()
    store.user = { email: 'familia@example.com', roles: ['ALUMNO_FAMILIA'] }
    await flushPromises()

    expect(wrapper.find('.workshop-card__enroll-button').exists()).toBe(false)
    expect(wrapper.text()).toContain('Ya estás apuntado/a')
  })
})
