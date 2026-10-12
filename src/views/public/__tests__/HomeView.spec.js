import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import HomeView from '../HomeView.vue'
import HeroWelcome from '@/components/home/HeroWelcome.vue'
import QuickInterestForm from '@/components/home/QuickInterestForm.vue'
import NextWorkshopCard from '@/components/home/NextWorkshopCard.vue'
import QuickContactCta from '@/components/home/QuickContactCta.vue'

describe('HomeView.vue', () => {
  it('renders the hero, the quick-interest form, the next workshop card and the contact CTA', () => {
    const wrapper = shallowMount(HomeView)

    expect(wrapper.findComponent(HeroWelcome).exists()).toBe(true)
    expect(wrapper.findComponent(QuickInterestForm).exists()).toBe(true)
    expect(wrapper.findComponent(NextWorkshopCard).exists()).toBe(true)
    expect(wrapper.findComponent(QuickContactCta).exists()).toBe(true)
  })
})
