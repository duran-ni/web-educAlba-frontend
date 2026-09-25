import { describe, it, expect } from 'vitest'

import { formatWorkshopDate } from '../formatWorkshopDate'

describe('formatWorkshopDate', () => {
  it('formats an ISO date as a long Spanish date, without a day offset', () => {
    const result = formatWorkshopDate('2026-10-24')

    expect(result).toBe('sábado, 24 de octubre')
  })
})
