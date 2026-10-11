import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'

import UserDashboardView from '../UserDashboardView.vue'
import { fetchMyProfile, fetchMyWorkshops } from '@/services/dashboard'

vi.mock('@/services/dashboard', () => ({
  fetchMyProfile: vi.fn(),
  fetchMyWorkshops: vi.fn(),
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/talleres', name: 'workshops', component: { template: '<div />' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div />' } },
  ],
})

function mountView() {
  return mount(UserDashboardView, { global: { plugins: [router] } })
}

describe('UserDashboardView.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the loading messages before the data arrives', () => {
    fetchMyProfile.mockReturnValue(new Promise(() => {}))
    fetchMyWorkshops.mockReturnValue(new Promise(() => {}))
    const wrapper = mountView()

    expect(wrapper.text()).toContain('Cargando…')
    expect(wrapper.text()).toContain('Cargando tus talleres…')
  })

  it('greets the student and lists their enrolled workshops once loaded', async () => {
    fetchMyProfile.mockResolvedValueOnce({ data: { firstName: 'Lucía' } })
    fetchMyWorkshops.mockResolvedValueOnce({
      data: [
        {
          enrollmentId: 1,
          workshopName: 'Robótica',
          date: '2026-10-24',
          time: '17:00',
          progress: 'En curso',
        },
      ],
    })
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.text()).toContain('¡Hola, Lucía!')
    expect(wrapper.findAll('.my-workshop-card').length).toBe(1)
  })

  it('shows an empty-state message with a link to Talleres when there are no enrollments', async () => {
    fetchMyProfile.mockResolvedValueOnce({ data: { firstName: 'Lucía' } })
    fetchMyWorkshops.mockResolvedValueOnce({ data: [] })
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.text()).toContain('¡No estás apuntado a ningún taller!')
    expect(wrapper.find('.user-dashboard-view__link').attributes('href')).toBe('/talleres')
  })

  it('shows an error message when the profile request fails', async () => {
    fetchMyProfile.mockRejectedValueOnce(new Error('network error'))
    fetchMyWorkshops.mockResolvedValueOnce({ data: [] })
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.text()).toContain('No hemos podido cargar tus datos. Inténtalo de nuevo más tarde.')
  })

  it('shows an error message when the workshops request fails', async () => {
    fetchMyProfile.mockResolvedValueOnce({ data: { firstName: 'Lucía' } })
    fetchMyWorkshops.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.text()).toContain(
      'No hemos podido cargar tus talleres. Inténtalo de nuevo más tarde.',
    )
  })
})
