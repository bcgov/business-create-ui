import { FirstNameRulesCustodian } from '@/rules/first-name-rules'
import { MiddleNameRulesCustodian } from '@/rules/middle-name-rules'

// Custodians sync to COLIN's CORP_PARTY table where FIRST_NME / MIDDLE_NME are VARCHAR2(30).
// These rules must allow up to 30 chars (vs. the default 20-char rules used for completing parties
// that sync to COMPLETING_PARTY where FIRST_NME / MIDDLE_NME are VARCHAR2(20)).

describe('FirstNameRulesCustodian', () => {
  const requiredRule = FirstNameRulesCustodian[0]
  const maxLengthRule = FirstNameRulesCustodian[1]

  describe('required rule', () => {
    it.each([
      ['empty string', ''],
      ['whitespace only', '   '],
      ['null', null],
      ['undefined', undefined]
    ])('returns error when value is %s', (_label, value) => {
      expect(requiredRule(value as string)).toBe('First name is required')
    })

    it('returns true when value has non-whitespace content', () => {
      expect(requiredRule('Alice')).toBe(true)
    })
  })

  describe('max length rule', () => {
    it('accepts a 30-character first name', () => {
      expect(maxLengthRule('a'.repeat(30))).toBe(true)
    })

    it('rejects a 31-character first name', () => {
      expect(maxLengthRule('a'.repeat(31))).toBe('Cannot exceed 30 characters')
    })

    it('accepts a 20-character first name (would have been the default cap)', () => {
      expect(maxLengthRule('a'.repeat(20))).toBe(true)
    })
  })
})

describe('MiddleNameRulesCustodian', () => {
  const leadingSpaceRule = MiddleNameRulesCustodian[0]
  const trailingSpaceRule = MiddleNameRulesCustodian[1]
  const maxLengthRule = MiddleNameRulesCustodian[2]

  describe('whitespace rules', () => {
    it('rejects a value with a leading space', () => {
      expect(leadingSpaceRule(' Alice')).toBe('Invalid spaces')
    })

    it('rejects a value with a trailing space', () => {
      expect(trailingSpaceRule('Alice ')).toBe('Invalid spaces')
    })

    it.each([
      ['empty string', ''],
      ['null', null],
      ['undefined', undefined]
    ])('accepts %s (middle name is optional)', (_label, value) => {
      expect(leadingSpaceRule(value as string)).toBe(true)
      expect(trailingSpaceRule(value as string)).toBe(true)
    })
  })

  describe('max length rule', () => {
    it('accepts an empty value (middle name is optional)', () => {
      expect(maxLengthRule('')).toBe(true)
      expect(maxLengthRule(null)).toBe(true)
      expect(maxLengthRule(undefined)).toBe(true)
    })

    it('accepts a 30-character middle name', () => {
      expect(maxLengthRule('a'.repeat(30))).toBe(true)
    })

    it('rejects a 31-character middle name', () => {
      expect(maxLengthRule('a'.repeat(31))).toBe('Cannot exceed 30 characters')
    })
  })
})
