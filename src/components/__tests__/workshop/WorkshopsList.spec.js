import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import WorkshopsList from '../WorkshopsList.vue'
import { fetchWorkshops } from '@/services/workshops'

vi.mock('@/services/workshops', () => ({
  fetchWorkshops: vi.fn(),
}))

describe('WorkshopsList.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  const workshop = {
    id: 1,
    name: 'Manos a la obra',
    description: 'Un taller sensorial pensado para los más pequeños.',
    date: '2026-10-24',
    recommendedAge: '1-2 años',
    room: null,
    active: true,
  }

  it('shows a card for each active workshop', async () => {
    fetchWorkshops.mockResolvedValueOnce({ status: 200, data: [workshop] })

    const wrapper = mount(WorkshopsList)
    await flushPromises()

    expect(wrapper.text()).toContain('Manos a la obra')
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
