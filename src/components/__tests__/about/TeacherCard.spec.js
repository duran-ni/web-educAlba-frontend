import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TeacherCard from '../../about/TeacherCard.vue'

const TEACHER = { id: 1, name: 'Laura Gómez', specialty: 'Matemáticas' }

describe('TeacherCard.vue', () => {
  it("renders the teacher's name and specialty", () => {
    const wrapper = mount(TeacherCard, { props: { teacher: TEACHER } })

    expect(wrapper.get('.teacher-card__name').text()).toBe('Laura Gómez')
    expect(wrapper.get('.teacher-card__specialty').text()).toBe('Matemáticas')
  })
})
