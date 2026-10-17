import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import AboutView from '../AboutView.vue'
import AboutIntro from '@/components/about/AboutIntro.vue'
import Timeline from '@/components/about/Timeline.vue'
import TeachersSection from '@/components/about/TeachersSection.vue'

describe('AboutView.vue', () => {
  it('renders the intro, the timeline and the teachers section', () => {
    const wrapper = shallowMount(AboutView)

    expect(wrapper.findComponent(AboutIntro).exists()).toBe(true)
    expect(wrapper.findComponent(Timeline).exists()).toBe(true)
    expect(wrapper.findComponent(TeachersSection).exists()).toBe(true)
  })
})
