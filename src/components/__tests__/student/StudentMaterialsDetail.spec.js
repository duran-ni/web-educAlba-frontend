import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import StudentMaterialsDetail from '../../student/StudentMaterialsDetail.vue'

const student = { id: 1, firstName: 'Lucía', lastName: 'García' }
const materials = [
  {
    id: 10,
    title: 'Worksheet 1',
    description: 'Ejercicios 1 y 2',
    fileUrl: 'https://res.cloudinary.com/demo/raw/upload/worksheet.pdf',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/fl_attachment:Worksheet_1/worksheet.pdf',
    uploadedAt: '2026-10-20T09:00:00',
  },
  {
    id: 11,
    title: 'Reading guide',
    description: '',
    fileUrl: 'https://res.cloudinary.com/demo/raw/upload/reading.pdf',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/fl_attachment:Reading_guide/reading.pdf',
    uploadedAt: '2026-10-22T09:00:00',
  },
]

describe('StudentMaterialsDetail.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the title with the student name and emits "back" when clicked', async () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    expect(wrapper.get('.student-materials-detail__title').text()).toBe('Materiales de Lucía García')

    await wrapper.get('.student-materials-detail__back').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('emits "upload-material" with the student when "Subir archivo" is clicked', async () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    await wrapper.get('.student-materials-detail__upload').trigger('click')
    expect(wrapper.emitted('upload-material')).toEqual([[student]])
  })

  it('shows an empty-state message when the student has no materials', () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials: [] } })
    expect(wrapper.get('.student-materials-detail__empty').text()).toBe(
      'Todavía no se le ha subido ningún PDF a este alumno.',
    )
    expect(wrapper.find('.student-materials-detail__list').exists()).toBe(false)
  })

  it('lists materials from the most recent to the oldest upload', () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    const items = wrapper.findAll('.student-materials-detail__item')

    expect(items).toHaveLength(2)
    expect(items[0].text()).toContain('Reading guide')
    expect(items[1].text()).toContain('Worksheet 1')
  })

  it('links the title to the downloadUrl, not the fileUrl', () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    const links = wrapper.findAll('.student-materials-detail__item-link')

    expect(links[0].attributes('href')).toBe(materials[1].downloadUrl)
  })

  it('shows the description only when the material has one', () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    const items = wrapper.findAll('.student-materials-detail__item')

    expect(items[0].find('.student-materials-detail__item-description').exists()).toBe(false)
    expect(items[1].find('.student-materials-detail__item-description').text()).toBe(
      'Ejercicios 1 y 2',
    )
  })

  it('emits "edit-material" with the material when "Editar" is clicked', async () => {
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    const items = wrapper.findAll('.student-materials-detail__item')
    await items[1].get('.student-materials-detail__item-edit').trigger('click')
    expect(wrapper.emitted('edit-material')).toEqual([[materials[0]]])
  })

  it('emits "delete-material" with the material id when the deletion is confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    const items = wrapper.findAll('.student-materials-detail__item')
    await items[0].get('.student-materials-detail__item-delete').trigger('click')
    expect(window.confirm).toHaveBeenCalled()
    expect(wrapper.emitted('delete-material')).toEqual([[materials[1].id]])
  })

  it('does not emit "delete-material" when the deletion is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = mount(StudentMaterialsDetail, { props: { student, materials } })
    const items = wrapper.findAll('.student-materials-detail__item')
    await items[0].get('.student-materials-detail__item-delete').trigger('click')
    expect(wrapper.emitted('delete-material')).toBeUndefined()
  })
})
