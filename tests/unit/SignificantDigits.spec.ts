import { SignificantDigits } from '@/utils/SignificantDigits'

describe('SignificantDigits', () => {
  it('returns 1 for zero', () => {
    expect(SignificantDigits(0)).toBe(1)
    expect(SignificantDigits('0')).toBe(1)
    expect(SignificantDigits('0000')).toBe(1)
  })

  it('returns correct count for positive integers', () => {
    expect(SignificantDigits(1)).toBe(1)
    expect(SignificantDigits(12)).toBe(2)
    expect(SignificantDigits(123)).toBe(3)
    expect(SignificantDigits(1000)).toBe(1)
  })

  it('returns correct count for negative integers', () => {
    expect(SignificantDigits(-1)).toBe(1)
    expect(SignificantDigits(-12)).toBe(2)
    expect(SignificantDigits(-123)).toBe(3)
    expect(SignificantDigits(-1000)).toBe(1)
  })

  it('returns correct count for decimal numbers', () => {
    expect(SignificantDigits(1.23)).toBe(3)
    expect(SignificantDigits(0.123)).toBe(3)
    expect(SignificantDigits(1.230)).toBe(3)
    expect(SignificantDigits(10.05)).toBe(4)
  })

  it('returns correct count for scientific notation', () => {
    expect(SignificantDigits('1.23e+45')).toBe(3)
    expect(SignificantDigits('1.23E+45')).toBe(3)
    expect(SignificantDigits('1.23e-45')).toBe(3)
    expect(SignificantDigits('1.0e+10')).toBe(1)
  })

  it('handles string inputs with commas', () => {
    expect(SignificantDigits('1,234')).toBe(4)
    expect(SignificantDigits('1,234.56')).toBe(6)
    expect(SignificantDigits('1,000')).toBe(1)
  })

  it('handles string inputs with leading/trailing spaces', () => {
    expect(SignificantDigits('  123  ')).toBe(3)
    expect(SignificantDigits(' 1.23 ')).toBe(3)
  })

  it('handles string inputs with sign', () => {
    expect(SignificantDigits('+123')).toBe(3)
    expect(SignificantDigits('-123')).toBe(3)
  })

  it('returns 0 for empty or invalid inputs', () => {
    expect(SignificantDigits('')).toBe(0)
    expect(SignificantDigits('   ')).toBe(0)
    expect(SignificantDigits('abc')).toBe(0)
    expect(SignificantDigits('12.34.56')).toBe(0)
    expect(SignificantDigits(null)).toBe(0)
    expect(SignificantDigits(undefined)).toBe(0)
  })

  it('handles edge cases with trailing zeros', () => {
    expect(SignificantDigits(100)).toBe(1)
    expect(SignificantDigits(1.00)).toBe(1)
    expect(SignificantDigits('100.00')).toBe(1)
    expect(SignificantDigits(1.20)).toBe(2)
  })

  it('handles edge cases with leading zeros', () => {
    expect(SignificantDigits(0.001)).toBe(1)
    expect(SignificantDigits(0.0123)).toBe(3)
    expect(SignificantDigits('0001.23')).toBe(3)
  })
})
