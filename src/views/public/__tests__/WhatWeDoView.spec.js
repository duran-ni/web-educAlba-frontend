import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import WhatWeDoView from '../WhatWeDoView.vue'
import MethodologyBlocks from '@/components/methodology/MethodologyBlocks.vue'
import MethodologyIllustration from '@/components/methodology/MethodologyIllustration.vue'

describe('WhatWeDoView.vue', () => {
  it('renders the methodology blocks and illustration', () => {
    const wrapper = shallowMount(WhatWeDoView)

    expect(wrapper.findComponent(MethodologyBlocks).exists()).toBe(true)
    expect(wrapper.findComponent(MethodologyIllustration).exists()).toBe(true)
  })
})
