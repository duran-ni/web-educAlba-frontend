import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import TeachersSection from '../../about/TeachersSection.vue'
import TeacherCard from '../../about/TeacherCard.vue'
import { fetchTeachers } from '@/services/teachers'

vi.mock('@/services/teachers', () => ({
  fetchTeachers: vi.fn(),
}))

async function mountSection() {
  const wrapper = mount(TeachersSection)
  await flushPromises()
  return wrapper
}

describe('TeachersSection.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading message while the teachers are being fetched', () => {
    fetchTeachers.mockReturnValueOnce(new Promise(() => {}))

    const wrapper = mount(TeachersSection)

    expect(wrapper.text()).toContain('Cargando el equipo…')
  })

  it('shows a card for each teacher once loaded', async () => {
    fetchTeachers.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'Laura Gómez', specialty: 'Matemáticas' },
        { id: 2, name: 'Marcos Ruiz', specialty: 'Educación Física' },
      ],
    })

    const wrapper = await mountSection()

    expect(wrapper.findAllComponents(TeacherCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Laura Gómez')
    expect(wrapper.text()).toContain('Marcos Ruiz')
  })

  it('shows an empty-state message when there are no teachers', async () => {
    fetchTeachers.mockResolvedValueOnce({ data: [] })

    const wrapper = await mountSection()

    expect(wrapper.text()).toContain('Todavía no hay profesores publicados.')
  })

  it('shows an error message when the request fails', async () => {
    fetchTeachers.mockRejectedValueOnce(new Error('network error'))

    const wrapper = await mountSection()

    expect(wrapper.text()).toContain(
      'No hemos podido cargar el equipo. Inténtalo de nuevo más tarde.'
    )
  })
})
