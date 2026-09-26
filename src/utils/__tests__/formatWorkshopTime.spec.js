import { describe, expect, it } from 'vitest'
import { formatWorkshopTime } from '../formatWorkshopTime'

describe('formatWorkshopTime', () => {
  it('formats an ISO time as HH:mm followed by "h"', () => {
    expect(formatWorkshopTime('10:00:00')).toBe('10:00 h')
  })

  it('keeps the leading zero of single-digit hours and minutes', () => {
    expect(formatWorkshopTime('09:05:00')).toBe('09:05 h')
  })

  it('returns an empty string when there is no time', () => {
    expect(formatWorkshopTime(null)).toBe('')
    expect(formatWorkshopTime(undefined)).toBe('')
  })
})
