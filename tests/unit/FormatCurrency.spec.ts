import { FormatCurrency } from '@/utils/FormatCurrency'

describe('FormatCurrency', () => {
  it('formats very small numbers in scientific notation', () => {
    expect(FormatCurrency(0.0000000000001)).toBe('1.0E-13')
    expect(FormatCurrency(0.000000000000123)).toBe('1.23E-13')
  })

  it('formats numbers with at least 2 decimal places', () => {
    expect(FormatCurrency(0.00000000000292397)).toBe('0.00000000000292397')
    expect(FormatCurrency(1.2345)).toBe('1.2345')
    expect(FormatCurrency(100)).toBe('100.00')
    expect(FormatCurrency(9999999.99)).toBe('9,999,999.99')
  })

  it('formats numbers with no decimal places (unless needed)', () => {
    expect(FormatCurrency(10000000)).toBe('10,000,000')
    expect(FormatCurrency(10000000.01)).toBe('10,000,000.01')
  })

  it('formats very large numbers in scientific notation', () => {
    expect(FormatCurrency(50000000000)).toBe('5.0E10')
    expect(FormatCurrency(1234000000000)).toBe('1.234E12')
  })
})
