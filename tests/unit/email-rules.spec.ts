import { EmailRules } from '@/rules/email-rules'

describe('Email Rules', () => {
  const requiredRule = EmailRules[0]
  const validEmailRule = EmailRules[1]

  describe('required rule', () => {
    it('returns error message when email is empty string', () => {
      expect(requiredRule('')).toBe('Email address is required')
    })

    it('returns error message when email is null', () => {
      expect(requiredRule(null)).toBe('Email address is required')
    })

    it('returns error message when email is undefined', () => {
      expect(requiredRule(undefined)).toBe('Email address is required')
    })

    it('returns true when email has a value', () => {
      expect(requiredRule('test@example.com')).toBe(true)
    })
  })

  describe('valid email rule', () => {
    // Valid emails
    it.each([
      ['test@example.com'],
      ['user.name@domain.com'],
      ['user+tag@example.com'],
      ['test@subdomain.example.com'],
      ['test@example.co.uk'],
      ['user@[192.168.1.1]'],
      ['no_one@never.get'],
      ['"quoted"@example.com'],
      ["john.o'smith@gov.bc.ca"]
    ])('returns true for valid email: %s', (email) => {
      expect(validEmailRule(email)).toBe(true)
    })

    // Invalid emails
    it.each([
      ['no_one@never.'],
      ['@invalid.com'],
      ['test@.com'],
      ['test@'],
      ['test@domain'],
      ['test @example.com'],
      ['test@ example.com']
    ])('returns error message for invalid email: %s', (email) => {
      expect(validEmailRule(email)).toBe('Valid email is required')
    })
  })
})
