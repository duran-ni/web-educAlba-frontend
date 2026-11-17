import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import WorkshopsView from '../WorkshopsView.vue'
import WorkshopsCalendar from '@/components/workshop/WorkshopsCalendar.vue'
import WorkshopsList from '@/components/workshop/WorkshopsList.vue'
import WorkshopEnrollmentForm from '@/components/workshop/WorkshopEnrollmentForm.vue'
import { useAuthStore } from '@/stores/auth'

function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return {
    wrapper: shallowMount(WorkshopsView, { global: { plugins: [pinia] } }),
    store: useAuthStore(),
  }
}

describe('WorkshopsView.vue', () => {
  it('renders the calendar, the workshops list and the public enrollment form for an anonymous visitor', () => {
    const { wrapper } = mountView()

    expect(wrapper.findComponent(WorkshopsCalendar).exists()).toBe(true)
    expect(wrapper.findComponent(WorkshopsList).exists()).toBe(true)
    expect(wrapper.findComponent(WorkshopEnrollmentForm).exists()).toBe(true)
  })

  it('hides the public enrollment form for a logged in family user', async () => {
    const { wrapper, store } = mountView()
    store.user = { email: 'familia@example.com', roles: ['ALUMNO_FAMILIA'] }
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(WorkshopEnrollmentForm).exists()).toBe(false)
  })

  it('still shows the public enrollment form for a logged in admin user', async () => {
    const { wrapper, store } = mountView()
    store.user = { email: 'admin@example.com', roles: ['ADMINISTRADOR'] }
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(WorkshopEnrollmentForm).exists()).toBe(true)
  })
})
