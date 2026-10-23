import { describe, it, expect } from 'vitest'

import { formatFileSize } from '../formatFileSize'

describe('formatFileSize', () => {
  it('formats a size under 1 MB as a rounded number of KB', () => {
    expect(formatFileSize(245_760)).toBe('240 KB')
  })

  it('rounds up when the KB value is not a whole number', () => {
    expect(formatFileSize(1_500)).toBe('1 KB')
  })

  it('formats a size of 1 MB or more as MB with one decimal', () => {
    expect(formatFileSize(1_572_864)).toBe('1.5 MB')
  })

  it('returns an empty string when there is no size', () => {
    expect(formatFileSize(null)).toBe('')
    expect(formatFileSize(undefined)).toBe('')
  })
})
