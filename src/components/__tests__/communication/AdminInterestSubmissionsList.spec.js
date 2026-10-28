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

  it('emits mark-reviewed with the submission id when the button is clicked', async () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [pendingSubmission] },
    })

    await wrapper.find('.admin-interest-submissions-list__review').trigger('click')

    expect(wrapper.emitted('mark-reviewed')).toEqual([[pendingSubmission.id]])
  })

  it('shows a reviewed badge instead of the action button for reviewed submissions', () => {
    const wrapper = mount(AdminInterestSubmissionsList, {
      props: { status: 'loaded', submissions: [reviewedSubmission] },
    })

    expect(wrapper.text()).toContain('Revisada')
    expect(wrapper.find('.admin-interest-submissions-list__review').exists()).toBe(false)
  })
})
