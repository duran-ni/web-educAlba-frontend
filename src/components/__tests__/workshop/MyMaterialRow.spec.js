import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import MyMaterialRow from '../../workshop/MyMaterialRow.vue'

describe('MyMaterialRow.vue', () => {
  const material = {
    id: 100,
    title: 'Worksheet 1',
    description: 'Ejercicios 1 y 2',
    fileUrl: 'https://res.cloudinary.com/demo/raw/upload/worksheet.pdf',
    downloadUrl:
      'https://res.cloudinary.com/demo/raw/upload/fl_attachment:Worksheet_1/worksheet.pdf',
    fileSizeBytes: 245_760,
    uploadedAt: '2026-10-22T09:00:00',
    studentId: 1,
    studentFullName: 'Lucía García',
  }

  it('shows the title, description and formatted size', () => {
    const wrapper = mount(MyMaterialRow, { props: { material } })

    expect(wrapper.text()).toContain('Worksheet 1')
    expect(wrapper.text()).toContain('Ejercicios 1 y 2')
    expect(wrapper.text()).toContain('240 KB')
  })

  it('links the title and the download button to the downloadUrl, not the fileUrl', () => {
    const wrapper = mount(MyMaterialRow, { props: { material } })
    const links = wrapper.findAll('a')

    expect(links).toHaveLength(2)
    links.forEach((link) => {
      expect(link.attributes('href')).toBe(material.downloadUrl)
    })
  })

  it('does not render a description paragraph when there is none', () => {
    const wrapper = mount(MyMaterialRow, {
      props: { material: { ...material, description: null } },
    })

    expect(wrapper.find('.my-material-row__description').exists()).toBe(false)
  })
})
