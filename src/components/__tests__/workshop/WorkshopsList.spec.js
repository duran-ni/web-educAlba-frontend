import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import WorkshopsList from '../../workshop/WorkshopsList.vue'
import { fetchWorkshops } from '@/services/workshops'

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

describe('WorkshopsList.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading message while the workshops are being fetched', () => {
    fetchWorkshops.mockReturnValueOnce(new Promise(() => {}))

    const wrapper = mount(WorkshopsList)

    expect(wrapper.text()).toContain('Cargando talleres…')
  })

  it('shows a card for each active workshop once they are loaded', async () => {
    fetchWorkshops.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          id: 1,
          name: 'Manos a la obra',
          description: 'Un taller sensorial pensado para los más pequeños.',
          date: '2026-10-24',
          time: '11:00:00',
          recommendedAge: '1-2 años',
          room: null,
          active: true,
        },
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

    const wrapper = mount(WorkshopsList)
    await flushPromises()

    expect(wrapper.text()).toContain('Manos a la obra')
    expect(wrapper.text()).toContain('Cuentacuentos')
  })

  it('shows an empty state when there are no active workshops', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [] })

    const wrapper = mount(WorkshopsList)
    await flushPromises()

    expect(wrapper.text()).toContain('No hay talleres activos actualmente.')
  })

  it('shows an error message when the request fails', async () => {
    fetchWorkshops.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(WorkshopsList)
    await flushPromises()

    expect(wrapper.text()).toContain('No hemos podido cargar los talleres. Inténtalo de nuevo más tarde.')
  })
})
