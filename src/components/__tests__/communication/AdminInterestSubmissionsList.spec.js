import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AdminInterestSubmissionsList from '../../communication/AdminInterestSubmissionsList.vue'

// Solicitud de ejemplo reutilizada en varios tests
const pendingSubmission = {
  id: 1,
  studentName: 'Juanito',
  courseToReinforce: 'Matemáticas 2º ESO',
  phone: '612345678',
  submittedAt: '2026-10-20T10:30:00',
  reviewed: false,
}

const reviewedSubmission = {
  ...pendingSubmission,
  id: 2,
  studentName: 'Maria',
  reviewed: true,
}

describe('AdminInterestSubmissionsList', () => {
  it('shows a loading message while status is loading', () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loading', submissions: [] },
    })

    expect(wrapper.text()).toContain('Cargando solicitudes')
  })

  it('shows an error message when status is error', () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'error', submissions: [] },
    })

    expect(wrapper.text()).toContain('No hemos podido cargar las solicitudes')
  })

  it('shows an empty state message when there are no submissions', () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [] },
    })

    expect(wrapper.text()).toContain('Todavía no ha llegado ninguna solicitud de interés')
  })

  it('renders the student name, course and phone of each submission', () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [pendingSubmission] },
    })

    expect(wrapper.text()).toContain('Juanito')
    expect(wrapper.text()).toContain('Matemáticas 2º ESO')
    expect(wrapper.text()).toContain('612345678')
  })

  it('shows no date when submittedAt is missing', () => {
    const submissionWithoutDate = { ...pendingSubmission, submittedAt: null }
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [submissionWithoutDate] },
    })

    expect(wrapper.find('.admin-interest-submissions-list__item-date').text()).toBe('')
  })

  it('shows "Marcar como revisada" and emits mark-reviewed for a pending submission', async () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [pendingSubmission] },
    })

    const button = wrapper.find('.admin-interest-submissions-list__review')
    expect(button.text()).toBe('Marcar como revisada')

    await button.trigger('click')

    expect(wrapper.emitted('mark-reviewed')).toEqual([[pendingSubmission.id]])
  })

  it('does not show the reviewed badge or the close button for a pending submission', () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [pendingSubmission] },
    })

    expect(wrapper.find('.admin-interest-submissions-list__reviewed-badge').exists()).toBe(false)
    expect(wrapper.find('.admin-interest-submissions-list__close').exists()).toBe(false)
  })

  it('shows the reviewed badge and "Marcar como no revisada", emitting mark-unreviewed when clicked', async () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [reviewedSubmission] },
    })

    expect(wrapper.find('.admin-interest-submissions-list__reviewed-badge').text()).toBe('Revisada')
    const button = wrapper.find('.admin-interest-submissions-list__review')
    expect(button.text()).toBe('Marcar como no revisada')

    await button.trigger('click')

    expect(wrapper.emitted('mark-unreviewed')).toEqual([[reviewedSubmission.id]])
  })

  it('shows the "Finalizado" button and emits close when clicked for a reviewed submission', async () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [reviewedSubmission] },
    })

    const closeButton = wrapper.find('.admin-interest-submissions-list__close')
    expect(closeButton.text()).toBe('Finalizado')

    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toEqual([[reviewedSubmission.id]])
  })
})
