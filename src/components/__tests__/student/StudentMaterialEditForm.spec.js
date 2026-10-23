import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import StudentMaterialEditForm from '../../student/StudentMaterialEditForm.vue'
import { updateStudentMaterial } from '@/services/materials'

vi.mock('@/services/materials', () => ({
  updateStudentMaterial: vi.fn(),
}))

const material = { id: 7, title: 'Worksheet 1', description: 'Ejercicios 1 y 2' }

describe('StudentMaterialEditForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('pre-fills the title and description with the current values', () => {
    const wrapper = mount(StudentMaterialEditForm, { props: { material } })

    expect(wrapper.get('#student-material-edit-title').element.value).toBe('Worksheet 1')
    expect(wrapper.get('#student-material-edit-description').element.value).toBe(
      'Ejercicios 1 y 2',
    )
  })

  it('pre-fills an empty description when the material has none', () => {
    const wrapper = mount(StudentMaterialEditForm, {
      props: { material: { ...material, description: null } },
    })

    expect(wrapper.get('#student-material-edit-description').element.value).toBe('')
  })

  it('shows a validation error and does not submit when the title is cleared', async () => {
    const wrapper = mount(StudentMaterialEditForm, { props: { material } })

    await wrapper.get('#student-material-edit-title').setValue('')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Escribe un título para este PDF')
    expect(updateStudentMaterial).not.toHaveBeenCalled()
  })

  it('updates the material and emits "updated" with the response data', async () => {
    const updated = { ...material, title: 'Tarea de Lengua' }
    updateStudentMaterial.mockResolvedValueOnce({ data: updated })
    const wrapper = mount(StudentMaterialEditForm, { props: { material } })

    await wrapper.get('#student-material-edit-title').setValue('Tarea de Lengua')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(updateStudentMaterial).toHaveBeenCalledWith(7, {
      title: 'Tarea de Lengua',
      description: 'Ejercicios 1 y 2',
    })
    expect(wrapper.emitted('updated')).toEqual([[updated]])
  })

  it('shows a generic error message when updating fails', async () => {
    updateStudentMaterial.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(StudentMaterialEditForm, { props: { material } })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido actualizar el material. Inténtalo de nuevo en unos minutos.',
    )
  })

  it('shows "Guardando…" and disables both buttons while the request is in flight', async () => {
    let resolveUpdate
    updateStudentMaterial.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveUpdate = resolve
      }),
    )
    const wrapper = mount(StudentMaterialEditForm, { props: { material } })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.get('.student-material-edit-form__submit').text()).toBe('Guardando…')
    expect(wrapper.get('.student-material-edit-form__submit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('.student-material-edit-form__cancel').attributes('disabled')).toBeDefined()

    resolveUpdate({ data: material })
    await flushPromises()
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(StudentMaterialEditForm, { props: { material } })
    await wrapper.get('.student-material-edit-form__cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
