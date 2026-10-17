import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TeacherCard from '../../about/TeacherCard.vue'

const TEACHER_WITHOUT_PHOTO = { id: 1, name: 'Laura Gómez', specialty: 'Matemáticas' }

const TEACHER_WITH_PHOTO = {
  id: 2,
  name: 'Marcos Ruiz',
  specialty: 'Educación Física',
  photoUrl: 'https://res.cloudinary.com/demo/marcos.jpg',
}

describe('TeacherCard.vue', () => {
  it("renders the teacher's name and specialty", () => {
    const wrapper = mount(TeacherCard, { props: { teacher: TEACHER_WITHOUT_PHOTO } })

    expect(wrapper.get('.teacher-card__name').text()).toBe('Laura Gómez')
    expect(wrapper.get('.teacher-card__specialty').text()).toBe('Matemáticas')
  })

  it('shows the generic avatar when the teacher has no photo', () => {
    const wrapper = mount(TeacherCard, { props: { teacher: TEACHER_WITHOUT_PHOTO } })

    expect(wrapper.find('.teacher-card__avatar').exists()).toBe(true)
    expect(wrapper.find('.teacher-card__photo').exists()).toBe(false)
  })

  it('shows the real photo when the teacher has one', () => {
    const wrapper = mount(TeacherCard, { props: { teacher: TEACHER_WITH_PHOTO } })

    const photo = wrapper.get('.teacher-card__photo')
    expect(photo.attributes('src')).toBe(TEACHER_WITH_PHOTO.photoUrl)
    expect(photo.attributes('alt')).toBe('Foto de Marcos Ruiz')
    expect(wrapper.find('.teacher-card__avatar').exists()).toBe(false)
  })
})
