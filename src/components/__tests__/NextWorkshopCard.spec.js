import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import NextWorkshopCard from '../NextWorkshopCard.vue'
import { fetchNextWorkshop } from '@/services/workshops'

vi.mock('@/services/workshops', () => ({
  fetchNextWorkshop: vi.fn(),
}))

describe('NextWorkshopCard.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the workshop name, description, date and time when there is an upcoming workshop', async () => {
    fetchNextWorkshop.mockResolvedValueOnce({
      status: 200,
      data: {
        id: 1,
        name: 'Taller de Robótica Creativa',
        description: 'Aprende a construir tus propios inventos.',
        date: '2026-06-15',
        time: '11:00:00',
        recommendedAge: '8-12 años',
        room: 'Aula 2',
        active: true,
      },
    })

    const wrapper = mount(NextWorkshopCard)
    await flushPromises()

    expect(wrapper.text()).toContain('Taller de Robótica Creativa')
    expect(wrapper.text()).toContain('Aprende a construir tus propios inventos.')
    expect(wrapper.text()).toContain('11:00 h')
  })

  it('shows an empty state when there are no upcoming workshops', async () => {
    fetchNextWorkshop.mockResolvedValueOnce({ status: 204, data: '' })

    const wrapper = mount(NextWorkshopCard)
    await flushPromises()

    expect(wrapper.text()).toContain('No hay talleres programados por el momento.')
  })

  it('shows an error message when the request fails', async () => {
    fetchNextWorkshop.mockRejectedValueOnce(new Error('network error'))

    const wrapper = mount(NextWorkshopCard)
    await flushPromises()

    expect(wrapper.text()).toContain('No hemos podido cargar el próximo taller. Inténtalo de nuevo más tarde.')
  })
})
