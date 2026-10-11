import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import WorkshopForm from '../../workshop/WorkshopForm.vue'
import { createWorkshop, updateWorkshop } from '@/services/workshops'

vi.mock('@/services/workshops', () => ({
  createWorkshop: vi.fn(),
  updateWorkshop: vi.fn(),
}))

const EXISTING_WORKSHOP = {
  id: 5,
  name: 'Robótica',
  description: 'Construye tu propio robot.',
  date: '2026-10-24',
  time: '17:00',
  recommendedAge: '8-12',
  room: 'Aula 3',
  active: false,
}

async function fillValidForm(wrapper) {
  await wrapper.get('#workshop-name').setValue('Teatro')
  await wrapper.get('#workshop-date').setValue('2026-11-02')
  await wrapper.get('#workshop-time').setValue('16:00')
}

describe('WorkshopForm.vue', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('blocks the submission and shows an error for each empty required field', async () => {
    const wrapper = mount(WorkshopForm)

    await wrapper.find('form').trigger('submit.prevent')

    expect(createWorkshop).not.toHaveBeenCalled()
    expect(wrapper.find('#workshop-name-error').text()).toBe('Escribe el nombre del taller')
    expect(wrapper.find('#workshop-date-error').text()).toBe('Selecciona una fecha')
    expect(wrapper.find('#workshop-time-error').text()).toBe('Selecciona una hora')
  })

  it('pre-fills the fields and shows "Guardar cambios" when editing an existing workshop', () => {
    const wrapper = mount(WorkshopForm, { props: { workshop: EXISTING_WORKSHOP } })

    expect(wrapper.get('#workshop-name').element.value).toBe('Robótica')
    expect(wrapper.get('#workshop-description').element.value).toBe('Construye tu propio robot.')
    expect(wrapper.get('#workshop-age').element.value).toBe('8-12')
    expect(wrapper.get('#workshop-room').element.value).toBe('Aula 3')
    expect(wrapper.get('.workshop-form__active-input').element.checked).toBe(false)
    expect(wrapper.get('.workshop-form__submit').text()).toBe('Guardar cambios')
  })

  it('creates a new workshop and emits "created" with the response data', async () => {
    const created = { id: 9, name: 'Teatro' }
    createWorkshop.mockResolvedValueOnce({ data: created })
    const wrapper = mount(WorkshopForm)
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(createWorkshop).toHaveBeenCalledWith({
      name: 'Teatro',
      description: '',
      date: '2026-11-02',
      time: '16:00',
      recommendedAge: '',
      room: '',
      active: true,
    })
    expect(wrapper.emitted('created')).toEqual([[created]])
  })

  it('updates an existing workshop and emits "updated" with the response data', async () => {
    const updated = { ...EXISTING_WORKSHOP, name: 'Robótica avanzada' }
    updateWorkshop.mockResolvedValueOnce({ data: updated })
    const wrapper = mount(WorkshopForm, { props: { workshop: EXISTING_WORKSHOP } })
    await wrapper.get('#workshop-name').setValue('Robótica avanzada')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(updateWorkshop).toHaveBeenCalledWith(
      EXISTING_WORKSHOP.id,
      expect.objectContaining({ name: 'Robótica avanzada' }),
    )
    expect(wrapper.emitted('updated')).toEqual([[updated]])
  })

  it('shows a generic error message when creating a workshop fails', async () => {
    createWorkshop.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(WorkshopForm)
    await fillValidForm(wrapper)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido guardar el taller. Inténtalo de nuevo en unos minutos.',
    )
  })

  it('shows a generic error message when updating a workshop fails', async () => {
    updateWorkshop.mockRejectedValueOnce(new Error('network error'))
    const wrapper = mount(WorkshopForm, { props: { workshop: EXISTING_WORKSHOP } })

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'No hemos podido guardar los cambios. Inténtalo de nuevo en unos minutos.',
    )
  })

  it('emits "cancel" when "Cancelar" is clicked', async () => {
    const wrapper = mount(WorkshopForm)

    await wrapper.get('.workshop-form__cancel').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
