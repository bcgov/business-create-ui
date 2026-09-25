import { AreOfficesComplete, AreOrgPersonsComplete, GetOfficeIssues, GetOrgPersonIssues,
  IsAddressValid, IsOrgPersonComplete, IsShareStructureComplete } from '@/utils'
import { OfficeAddressSchema, PersonAddressSchema } from '@/schemas'
import { CurrencyCodes } from '@/constants'

const VALID_BC_ADDRESS: any = {
  streetAddress: '123 Main St',
  streetAddressAdditional: '',
  addressCity: 'Victoria',
  addressRegion: 'BC',
  addressCountry: 'CA',
  postalCode: 'V8V 8V8',
  deliveryInstructions: ''
}

const VALID_DIRECTOR: any = {
  officer: { partyType: 'person', firstName: 'JANE', lastName: 'DOE' },
  mailingAddress: { ...VALID_BC_ADDRESS },
  deliveryAddress: { ...VALID_BC_ADDRESS },
  roles: [{ roleType: 'Director', appointmentDate: '2010-05-05' }]
}

const VALID_OFFICES: any = {
  registeredOffice: {
    mailingAddress: { ...VALID_BC_ADDRESS },
    deliveryAddress: { ...VALID_BC_ADDRESS }
  },
  recordsOffice: {
    mailingAddress: { ...VALID_BC_ADDRESS },
    deliveryAddress: { ...VALID_BC_ADDRESS }
  }
}

describe('IsAddressValid', () => {
  it('accepts a complete person address', () => {
    expect(IsAddressValid(VALID_BC_ADDRESS, PersonAddressSchema)).toBe(true)
  })

  it('rejects a nullish address', () => {
    expect(IsAddressValid(null, PersonAddressSchema)).toBe(false)
    expect(IsAddressValid(undefined, OfficeAddressSchema)).toBe(false)
  })

  it('rejects a missing or empty street address', () => {
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, streetAddress: '' }, PersonAddressSchema)).toBe(false)
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, streetAddress: null }, PersonAddressSchema)).toBe(false)
  })

  it('rejects a missing city or country', () => {
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, addressCity: '' }, PersonAddressSchema)).toBe(false)
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, addressCountry: '' }, PersonAddressSchema)).toBe(false)
  })

  it('rejects a missing or malformed Canadian postal code', () => {
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, postalCode: '' }, PersonAddressSchema)).toBe(false)
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, postalCode: '12345' }, PersonAddressSchema)).toBe(false)
  })

  it('applies office-only rules (must be in BC, Canada)', () => {
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, addressCountry: 'US', addressRegion: 'WA', postalCode: '98101' },
      OfficeAddressSchema)).toBe(false)
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, addressRegion: 'ON' }, OfficeAddressSchema)).toBe(false)
    // but a person may be anywhere
    expect(IsAddressValid({ ...VALID_BC_ADDRESS, addressCountry: 'US', addressRegion: 'WA', postalCode: '98101' },
      PersonAddressSchema)).toBe(true)
  })
})

describe('IsOrgPersonComplete / AreOrgPersonsComplete', () => {
  it('accepts a complete director', () => {
    expect(IsOrgPersonComplete(VALID_DIRECTOR)).toBe(true)
  })

  it('requires a last name but not a first name (matching the API)', () => {
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: '', lastName: 'DOE' }
    })).toBe(true)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', lastName: 'DOE' }
    })).toBe(true)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: 'JANE', lastName: '  ' }
    })).toBe(false)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: 'JANE' }
    })).toBe(false)
  })

  it('requires an organization name for orgs but not person names', () => {
    const org = {
      ...VALID_DIRECTOR,
      officer: { partyType: 'organization', organizationName: 'ACME LTD' },
      roles: [{ roleType: 'Incorporator' }]
    }
    expect(IsOrgPersonComplete(org)).toBe(true)
    expect(IsOrgPersonComplete({
      ...org, officer: { partyType: 'organization', organizationName: '' }
    })).toBe(false)
  })

  it('rejects a director with an incomplete delivery address', () => {
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR,
      deliveryAddress: { ...VALID_BC_ADDRESS, streetAddress: '' }
    })).toBe(false)
    expect(IsOrgPersonComplete({ ...VALID_DIRECTOR, deliveryAddress: null })).toBe(false)
  })

  it('does not require a delivery address for non-director roles', () => {
    const completingParty = {
      ...VALID_DIRECTOR,
      deliveryAddress: undefined,
      roles: [{ roleType: 'Completing Party' }]
    }
    expect(IsOrgPersonComplete(completingParty)).toBe(true)
  })

  it('rejects a person with an incomplete mailing address', () => {
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR,
      mailingAddress: { ...VALID_BC_ADDRESS, addressCity: '' }
    })).toBe(false)
  })

  it('validates the whole list (empty list is valid)', () => {
    expect(AreOrgPersonsComplete([])).toBe(true)
    expect(AreOrgPersonsComplete(null)).toBe(true)
    expect(AreOrgPersonsComplete([VALID_DIRECTOR])).toBe(true)
    expect(AreOrgPersonsComplete([
      VALID_DIRECTOR,
      { ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: 'JANE', lastName: '' } }
    ])).toBe(false)
  })

  it('measures names trimmed, as the API trims the submission before validating', () => {
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: ' JANE ', lastName: ' DOE ' }
    })).toBe(true)
    // padding does not push a name over its length limit
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: ` ${'A'.repeat(20)} `, lastName: 'DOE' }
    })).toBe(true)
  })

  it('applies the API name length limits (first/middle 20, last 30)', () => {
    const name20 = 'A'.repeat(20)
    const name30 = 'B'.repeat(30)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: name20, lastName: name30, middleName: name20 }
    })).toBe(true)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: name20 + 'A', lastName: 'DOE' }
    })).toBe(false)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: 'JANE', lastName: name30 + 'B' }
    })).toBe(false)
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: 'JANE', lastName: 'DOE', middleName: name20 + 'A' }
    })).toBe(false)
  })

  it('skips name checks for a locked Completing Party (pre-populated, not editable)', () => {
    const longNameCompletingParty: any = {
      officer: { partyType: 'person', firstName: 'A'.repeat(21), lastName: 'B'.repeat(31) },
      mailingAddress: { ...VALID_BC_ADDRESS },
      roles: [{ roleType: 'Completing Party', appointmentDate: '2010-05-05' }]
    }
    // blocked when the name is editable
    expect(AreOrgPersonsComplete([longNameCompletingParty])).toBe(false)
    expect(AreOrgPersonsComplete([longNameCompletingParty], false)).toBe(false)
    // skipped when the name is locked
    expect(AreOrgPersonsComplete([longNameCompletingParty], true)).toBe(true)
    // the lock only covers the Completing Party, not other people
    expect(AreOrgPersonsComplete([
      longNameCompletingParty,
      { ...VALID_DIRECTOR, officer: { partyType: 'person', firstName: 'A'.repeat(21), lastName: 'DOE' } }
    ], true)).toBe(false)
    // the lock only covers names — an incomplete address still blocks
    expect(AreOrgPersonsComplete([{ ...longNameCompletingParty, mailingAddress: null }], true)).toBe(false)
  })

  it('lists the reasons an org-person is invalid', () => {
    expect(GetOrgPersonIssues(VALID_DIRECTOR)).toEqual([])
    expect(GetOrgPersonIssues({
      ...VALID_DIRECTOR,
      officer: { partyType: 'person', firstName: 'JANE', lastName: '' },
      deliveryAddress: null
    })).toEqual(['Last name is missing', 'Delivery Address is incorrect or incomplete'])
    expect(GetOrgPersonIssues({
      ...VALID_DIRECTOR,
      officer: { partyType: 'person', firstName: 'A'.repeat(21), lastName: 'DOE' }
    })).toEqual(['First name exceeds 20 characters'])
    expect(GetOrgPersonIssues({
      ...VALID_DIRECTOR,
      officer: { partyType: 'organization', organizationName: '' },
      roles: [{ roleType: 'Incorporator' }]
    })).toEqual(['Organization name is missing'])
  })

  it('rejects cross-type name contamination', () => {
    // a person must not carry an organization name
    expect(IsOrgPersonComplete({
      ...VALID_DIRECTOR,
      officer: { partyType: 'person', firstName: 'JANE', lastName: 'DOE', organizationName: 'ACME LTD' }
    })).toBe(false)
    // an organization must not carry person name fields
    const org = {
      ...VALID_DIRECTOR,
      officer: { partyType: 'organization', organizationName: 'ACME LTD' },
      roles: [{ roleType: 'Incorporator' }]
    }
    expect(IsOrgPersonComplete({
      ...org, officer: { ...org.officer, lastName: 'DOE' }
    })).toBe(false)
    // blank-only person fields on an organization are fine (the API trims them away)
    expect(IsOrgPersonComplete({
      ...org, officer: { ...org.officer, lastName: ' ' }
    })).toBe(true)
  })
})

describe('AreOfficesComplete', () => {
  it('accepts complete registered and records offices', () => {
    expect(AreOfficesComplete(VALID_OFFICES)).toBe(true)
  })

  it('rejects nullish or missing offices', () => {
    expect(AreOfficesComplete(null)).toBe(false)
    expect(AreOfficesComplete({ registeredOffice: VALID_OFFICES.registeredOffice } as any)).toBe(false)
  })

  it('rejects an office with an incomplete address', () => {
    expect(AreOfficesComplete({
      ...VALID_OFFICES,
      recordsOffice: {
        mailingAddress: { ...VALID_BC_ADDRESS, streetAddress: '' },
        deliveryAddress: { ...VALID_BC_ADDRESS }
      }
    })).toBe(false)
  })

  it('lists the reasons an office is invalid', () => {
    expect(GetOfficeIssues(VALID_OFFICES.registeredOffice)).toEqual([])
    expect(GetOfficeIssues({
      mailingAddress: { ...VALID_BC_ADDRESS, streetAddress: '' },
      deliveryAddress: { ...VALID_BC_ADDRESS }
    })).toEqual(['Mailing Address is incorrect or incomplete'])
    expect(GetOfficeIssues(null)).toEqual([
      'Mailing Address is incorrect or incomplete',
      'Delivery Address is incorrect or incomplete'
    ])
  })
})

describe('IsShareStructureComplete', () => {
  const validClass: any = {
    name: 'Class A Shares',
    hasMaximumShares: true,
    maxNumberOfShares: 10000,
    hasParValue: true,
    parValue: 1.5,
    currency: 'CAD',
    hasRightsOrRestrictions: true,
    series: [{
      name: 'Series 1 Shares',
      hasMaximumShares: false,
      maxNumberOfShares: null
    }]
  }

  it('accepts a complete share structure', () => {
    expect(IsShareStructureComplete([validClass])).toBe(true)
  })

  it('rejects an empty or nullish share structure', () => {
    expect(IsShareStructureComplete([])).toBe(false)
    expect(IsShareStructureComplete(null)).toBe(false)
  })

  it('rejects a class with a blank name', () => {
    expect(IsShareStructureComplete([{ ...validClass, name: '' }])).toBe(false)
  })

  it('requires class and series names to end with " Shares"', () => {
    expect(IsShareStructureComplete([{ ...validClass, name: 'Class A' }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, name: 'CLASS A SHARES' }])).toBe(false)
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [{ name: 'Series 1', hasMaximumShares: false }]
    }])).toBe(false)
    // padding is fine - the API trims the submission before validating
    expect(IsShareStructureComplete([{ ...validClass, name: ' Class A Shares ' }])).toBe(true)
  })

  it('rejects reserved words in class and series names', () => {
    expect(IsShareStructureComplete([{ ...validClass, name: 'Special Value Shares' }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, name: 'Preferred Share Shares' }])).toBe(false)
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [{ name: 'First Share Shares', hasMaximumShares: false }]
    }])).toBe(false)
    // "value" is reserved for classes only
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [{ name: 'High Value Shares', hasMaximumShares: false }]
    }])).toBe(true)
  })

  it('rejects duplicate names among classes and within a class\' series', () => {
    expect(IsShareStructureComplete([
      validClass,
      { ...validClass, name: 'Class A Shares' }
    ])).toBe(false)
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [
        { name: 'Series 1 Shares', hasMaximumShares: false },
        { name: 'Series 1 Shares', hasMaximumShares: false }
      ]
    }])).toBe(false)
    // the same series name in different classes is fine
    expect(IsShareStructureComplete([
      validClass,
      { ...validClass, name: 'Class B Shares' }
    ])).toBe(true)
  })

  it('rejects a missing maximum when the class has one', () => {
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: null }])).toBe(false)
    // no maximum means no count is needed
    expect(IsShareStructureComplete([{ ...validClass, hasMaximumShares: false, maxNumberOfShares: null }]))
      .toBe(true)
  })

  it('requires the maximum number of shares to be a whole number within the digit limits', () => {
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: 100.5 }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: '10000' }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: 0 }])).toBe(false)
    // 21 digits exceeds the API's 20-digit limit
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: 1e20 }])).toBe(false)
    // 17 significant digits exceeds the API's 16
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: 12345678901234568 }])).toBe(false)
    // 16 significant digits is fine
    expect(IsShareStructureComplete([{ ...validClass, maxNumberOfShares: 1234567890123456 }])).toBe(true)
  })

  it('rejects par value classes missing the par value or currency', () => {
    expect(IsShareStructureComplete([{ ...validClass, parValue: null }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, currency: null }])).toBe(false)
    // no par value means neither is needed
    expect(IsShareStructureComplete([{ ...validClass, hasParValue: false, parValue: null, currency: null }]))
      .toBe(true)
  })

  it('requires the par value to be a valid positive number within the digit limits', () => {
    expect(IsShareStructureComplete([{ ...validClass, parValue: '1.5' }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, parValue: Infinity }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, parValue: 0 }])).toBe(false)
    // 17 significant digits exceeds the API's 16
    expect(IsShareStructureComplete([{ ...validClass, parValue: 0.12345678901234568 }])).toBe(false)
  })

  it('requires a currently-valid ISO 4217 currency (no OTHER grandfathering)', () => {
    expect(IsShareStructureComplete([{ ...validClass, currency: 'OTHER' }])).toBe(false)
    // BYR is a retired code the API rejects
    expect(IsShareStructureComplete([{ ...validClass, currency: 'BYR' }])).toBe(false)
    expect(IsShareStructureComplete([{ ...validClass, currency: 'USD' }])).toBe(true)
  })

  it('rejects series on a class without rights or restrictions', () => {
    expect(IsShareStructureComplete([{ ...validClass, hasRightsOrRestrictions: false }])).toBe(false)
    // no series makes rights or restrictions optional
    expect(IsShareStructureComplete([{ ...validClass, hasRightsOrRestrictions: false, series: [] }])).toBe(true)
  })

  it('rejects a series with more shares than its class', () => {
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [{ name: 'Series 1 Shares', hasMaximumShares: true, maxNumberOfShares: 10001 }]
    }])).toBe(false)
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [{ name: 'Series 1 Shares', hasMaximumShares: true, maxNumberOfShares: 10000 }]
    }])).toBe(true)
    // no class maximum means no cap on the series
    expect(IsShareStructureComplete([{
      ...validClass,
      hasMaximumShares: false,
      maxNumberOfShares: null,
      series: [{ name: 'Series 1 Shares', hasMaximumShares: true, maxNumberOfShares: 999999 }]
    }])).toBe(true)
  })

  it('validates series too', () => {
    expect(IsShareStructureComplete([{
      ...validClass,
      series: [{ name: '', hasMaximumShares: false }]
    }])).toBe(false)
  })
})

describe('CurrencyCodes', () => {
  it('contains no retired ISO 4217 codes (the API rejects them)', () => {
    const retired = ['BYR', 'EEK', 'GQE', 'LTL', 'LVL', 'MRO', 'MZM', 'VEB', 'ZMK', 'ZWR']
    retired.forEach(code => expect(CurrencyCodes.has(code)).toBe(false))
  })

  it('contains the successor codes and the majors', () => {
    const expected = ['CAD', 'USD', 'EUR', 'BYN', 'MRU', 'MZN', 'VES', 'ZMW', 'ZWL']
    expected.forEach(code => expect(CurrencyCodes.has(code)).toBe(true))
  })
})
