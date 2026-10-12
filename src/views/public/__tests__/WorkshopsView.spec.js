import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import WorkshopsView from '../WorkshopsView.vue'
import WorkshopsCalendar from '@/components/workshop/WorkshopsCalendar.vue'
import WorkshopsList from '@/components/workshop/WorkshopsList.vue'
import WorkshopEnrollmentForm from '@/components/workshop/WorkshopEnrollmentForm.vue'

describe('WorkshopsView.vue', () => {
  it('renders the calendar, the workshops list and the enrollment form', () => {
    const wrapper = shallowMount(WorkshopsView)

    expect(wrapper.findComponent(WorkshopsCalendar).exists()).toBe(true)
    expect(wrapper.findComponent(WorkshopsList).exists()).toBe(true)
    expect(wrapper.findComponent(WorkshopEnrollmentForm).exists()).toBe(true)
  })
})
