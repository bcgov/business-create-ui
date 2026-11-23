import { DecodeApiError, DecodeApiErrors, GetApiErrorPayload } from '@/utils'

// filing echoed by the API in its error response (dissolution with a custodian and a completing party)
const filing = {
  header: { name: 'dissolution' },
  business: { identifier: 'BC0870803' },
  dissolution: {
    dissolutionType: 'voluntary',
    parties: [
      {
        officer: { partyType: 'person', firstName: 'Jane', middleName: 'Q', lastName: 'Doe' },
        roles: [{ roleType: 'Custodian' }, { roleType: 'Completing Party' }]
      },
      {
        officer: { partyType: 'organization', organizationName: 'Custodians Inc' },
        roles: [{ roleType: 'Custodian' }]
      },
      {
        officer: { partyType: 'person', firstName: 'John', lastName: 'Smith' },
        roles: [{ roleType: 'Completing Party' }]
      }
    ]
  }
}

describe('GetApiErrorPayload', () => {
  it('unwraps the rootCause added by the API Gateway', () => {
    const error = { response: { data: { errorMessage: 'API backend third party service error.',
      rootCause: { errors: [{ error: 'x' }] } } } }
    expect(GetApiErrorPayload(error)).toEqual({ errors: [{ error: 'x' }] })
  })

  it('returns the body of a direct API response', () => {
    const error = { response: { data: { errors: [{ error: 'x' }] } } }
    expect(GetApiErrorPayload(error)).toEqual({ errors: [{ error: 'x' }] })
  })

  it('returns undefined when there is no response', () => {
    expect(GetApiErrorPayload(new Error('Network Error'))).toBeUndefined()
    expect(GetApiErrorPayload(null)).toBeUndefined()
  })
})

describe('DecodeApiError - dissolution', () => {
  it.each([
    ['/filing/dissolution/dissolutionType', 'Dissolution type must be provided.',
      'Dissolution type: Dissolution type must be provided.'],
    ['/filing/dissolution/dissolutionDate', 'Invalid date.', 'Dissolution date: Invalid date.'],
    ['/filing/dissolution/details', 'Administrative dissolution must have details',
      'Dissolution details: Administrative dissolution must have details'],
    ['/filing/dissolution/dissolutionStatementType', 'Dissolution statement type must be provided.',
      'Dissolution statement: Dissolution statement type must be provided.'],
    ['/filing/dissolution/affidavitFileKey', 'A valid affidavit key is required.',
      'Affidavit: A valid affidavit key is required.'],
    ['/filing/dissolution/courtOrder', 'Court Order is required (in orderDetails/fileKey/files).',
      'Court order: Court Order is required (in orderDetails/fileKey/files).'],
    ['/filing/dissolution/courtOrder/orderDate', 'Court order date cannot be in the future.',
      'Court order: Court order date cannot be in the future.'],
    ['/filing/dissolution/custodialOffice/mailingAddress/postalCode', 'Postal code is required.',
      'Custodial office mailing address: Postal code is required.'],
    ['/filing/dissolution/custodialOffice', 'Custodial office is required.',
      'Custodial office: Custodial office is required.'],
    ['/filing/dissolution/parties', 'Must have a minimum of one custodian.',
      'Parties: Must have a minimum of one custodian.'],
    ['/filing/dissolution/parties/roles', 'Invalid party role(s) provided: Director.',
      'Parties: Invalid party role(s) provided: Director.'],
    ['/filing/dissolution', 'Dissolution is required.', 'Dissolution: Dissolution is required.'],
    ['/filing/specialResolution/resolutionDate', 'Resolution date is required.',
      'Special resolution: Resolution date is required.'],
    ['/filing/header/certifiedBy', 'Certified by is required.', 'Certified by: Certified by is required.'],
    ['/filing/header/effectiveDate', 'Invalid effective date.', 'Effective date: Invalid effective date.'],
    ['/filing/header/paymentToken', 'Payment failed.', 'Filing header: Payment failed.'],
    ['/filing/business/identifier', 'Invalid identifier.', 'Business: Invalid identifier.']
  ])('decodes %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, filing)).toBe(expected)
  })

  it.each([
    ['/filing/dissolution/parties/0/officer/email', 'Custodian email is required.',
      'Custodian (Jane Q Doe) email: Custodian email is required.'],
    ['/filing/dissolution/parties/0/officer/lastName', 'Last name is required.',
      'Custodian (Jane Q Doe) name: Last name is required.'],
    ['/filing/dissolution/parties/0/mailingAddress/postalCode', 'Postal code is required.',
      'Custodian (Jane Q Doe) mailing address: Postal code is required.'],
    ['/filing/dissolution/parties/0/deliveryAddress/addressRegion', 'Address must be in BC.',
      'Custodian (Jane Q Doe) delivery address: Address must be in BC.'],
    ['/filing/dissolution/parties/0/roles/0/appointmentDate', 'Invalid appointment date.',
      'Custodian (Jane Q Doe) role: Invalid appointment date.'],
    ['/filing/dissolution/parties/0', 'Invalid party.', 'Custodian (Jane Q Doe): Invalid party.'],
    ['/filing/dissolution/parties/1/mailingAddress', 'mailingAddress is required.',
      'Custodian (Custodians Inc) mailing address: mailingAddress is required.'],
    ['/filing/dissolution/parties/2/officer/email', 'Email is required.',
      'Completing Party (John Smith) email: Email is required.']
  ])('names the party for %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, filing)).toBe(expected)
  })

  it('falls back to the party number when the filing is not available', () => {
    const err = { error: 'Postal code is required.', path: '/filing/dissolution/parties/1/mailingAddress/postalCode' }
    expect(DecodeApiError(err)).toBe('Party 2 mailing address: Postal code is required.')
    expect(DecodeApiError(err, { dissolution: { parties: [] } }))
      .toBe('Party 2 mailing address: Postal code is required.')
  })

  it('accepts the filing wrapped in a "filing" object', () => {
    const err = { error: 'Custodian email is required.', path: '/filing/dissolution/parties/0/officer/email' }
    expect(DecodeApiError(err, { filing })).toBe('Custodian (Jane Q Doe) email: Custodian email is required.')
  })

  it('uses the role alone when the party has no name', () => {
    const noName = { dissolution: { parties: [{ officer: {}, roles: [{ roleType: 'Custodian' }] }] } }
    expect(DecodeApiError({ error: 'First name is required.', path: '/filing/dissolution/parties/0/officer/firstName' },
      noName)).toBe('Custodian name: First name is required.')
  })

  it('decodes a schema error from its first context item', () => {
    const err = {
      path: 'filing/dissolution',
      error: '12345 is not valid under any of the given schemas',
      context: [
        {
          message: "12345 is not of type 'string'",
          jsonPath: '$.filing.dissolution.parties[0].mailingAddress.postalCode'
        },
        { message: 'ignored second context', jsonPath: '$.filing.dissolution.parties[0].mailingAddress' }
      ]
    }
    expect(DecodeApiError(err, filing)).toBe("Custodian (Jane Q Doe) mailing address: 12345 is not of type 'string'")
  })

  it('returns the API message alone for an unknown path', () => {
    expect(DecodeApiError({ error: 'Something is wrong.', path: '/filing/incorporationApplication/offices' }, filing))
      .toBe('Something is wrong.')
    expect(DecodeApiError({ error: 'Something is wrong.', path: '/filing/dissolution/unknownProperty' }, filing))
      .toBe('Something is wrong.')
  })

  it('returns the API message alone when there is no path', () => {
    expect(DecodeApiError({ error: 'A valid business and filing are required.' }))
      .toBe('A valid business and filing are required.')
    expect(DecodeApiError({} as any)).toBe('Unknown error')
    expect(DecodeApiError(null as any)).toBe('Unknown error')
  })
})

describe('DecodeApiErrors', () => {
  it('decodes every error and keeps the other properties', () => {
    const errors = [
      { error: 'Custodian email is required.', path: '/filing/dissolution/parties/0/officer/email' },
      { error: 'Address must be in BC.', path: '/filing/dissolution/parties/0/deliveryAddress/addressRegion' }
    ]
    expect(DecodeApiErrors(errors, filing)).toEqual([
      { error: 'Custodian (Jane Q Doe) email: Custodian email is required.',
        path: '/filing/dissolution/parties/0/officer/email' },
      { error: 'Custodian (Jane Q Doe) delivery address: Address must be in BC.',
        path: '/filing/dissolution/parties/0/deliveryAddress/addressRegion' }
    ])
    // input is not mutated
    expect(errors[0].error).toBe('Custodian email is required.')
  })

  it('wraps plain string errors and tolerates a non-array', () => {
    expect(DecodeApiErrors(['Plain message'] as any)).toEqual([{ error: 'Plain message' }])
    expect(DecodeApiErrors(null as any)).toEqual([])
    expect(DecodeApiErrors({ message: 'x' } as any)).toEqual([])
  })
})
