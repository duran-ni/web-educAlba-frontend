import { describe, it, expect } from 'vitest'

import { formatWorkshopPrice } from '../formatWorkshopPrice'

describe('formatWorkshopPrice', () => {
  it('formats a positive price as euros, with two decimals', () => {
    expect(formatWorkshopPrice(25)).toBe('25,00 €')
  })

  it('formats a price with decimals, rounding to two of them', () => {
    expect(formatWorkshopPrice(12.5)).toBe('12,50 €')
  })

  it('shows "Gratis" when the price is zero', () => {
    expect(formatWorkshopPrice(0)).toBe('Gratis')
  })

  it('returns an empty string when there is no price', () => {
    expect(formatWorkshopPrice(null)).toBe('')
    expect(formatWorkshopPrice(undefined)).toBe('')
  })
})
