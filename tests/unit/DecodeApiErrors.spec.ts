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
    expect(DecodeApiError({ error: 'Something is wrong.', path: '/filing/amalgamationApplication/offices' }, filing))
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

// filing echoed by the API in its error response (incorporation application with directors and share classes)
const iaFiling = {
  header: { name: 'incorporationApplication' },
  business: { identifier: 'TRtKAWg7Ah', legalType: 'BC' },
  incorporationApplication: {
    nameRequest: { legalType: 'BC' },
    parties: [
      {
        officer: { partyType: 'person', firstName: 'Jane', lastName: 'Doe' },
        roles: [{ roleType: 'Completing Party' }, { roleType: 'Incorporator' }, { roleType: 'Director' }]
      },
      {
        officer: { partyType: 'person', firstName: 'John', lastName: 'Smith' },
        roles: [{ roleType: 'Director' }]
      },
      {
        officer: { partyType: 'organization', organizationName: 'Incorporators Ltd' },
        roles: [{ roleType: 'Incorporator' }]
      }
    ],
    shareStructure: {
      shareClasses: [
        { name: 'Class A Shares', series: [{ name: 'Series 1 Shares' }] },
        { name: 'Class B Shares', series: [] }
      ]
    }
  }
}

describe('DecodeApiError - incorporation application', () => {
  it.each([
    ['/filing/incorporationApplication/nameRequest/legalType', 'Legal type is required.',
      'Name request: Legal type is required.'],
    ['/filing/incorporationApplication/nameRequest/nrNumber', 'Name Request is not approved.',
      'Name request: Name Request is not approved.'],
    ['/filing/incorporationApplication/nameRequest', 'Legal name and nrNumber is missing in nameRequest.',
      'Name request: Legal name and nrNumber is missing in nameRequest.'],
    ['/filing/incorporationApplication/offices', 'recordsOffice is required',
      'Offices: recordsOffice is required'],
    ['/filing/incorporationApplication/offices/registeredOffice', 'Address Region must be \'BC\'.',
      'Registered office: Address Region must be \'BC\'.'],
    ['/filing/incorporationApplication/offices/registeredOffice/mailingAddress/postalCode', 'Postal code is required.',
      'Registered office mailing address: Postal code is required.'],
    ['/filing/incorporationApplication/offices/recordsOffice/deliveryAddress/addressRegion',
      'Address Region must be \'BC\'.', 'Records office delivery address: Address Region must be \'BC\'.'],
    ['/filing/incorporationApplication/offices/recordsOffice/deliveryAddress', 'Address Country must be \'CA\'.',
      'Records office delivery address: Address Country must be \'CA\'.'],
    ['/filing/incorporationApplication/parties/roles', 'Must have a minimum of one Incorporator',
      'Parties: Must have a minimum of one Incorporator'],
    ['/filing/incorporationApplication/parties/mailingAddress', 'Must have minimum of one BC mailing address',
      'Parties: Must have minimum of one BC mailing address'],
    ['/filing/incorporationApplication/parties', 'Director first name is required',
      'Parties: Director first name is required'],
    ['/filing/incorporationApplication/shareStructure/shareClasses',
      'A company must have at least one Class of Shares.',
      'Share structure: A company must have at least one Class of Shares.'],
    ['/filing/incorporationApplication/shareStructure', 'Share structure is required.',
      'Share structure: Share structure is required.'],
    ['/filing/incorporationApplication/cooperative', 'cooperative data is missing in incorporationApplication.',
      'Cooperative documents: cooperative data is missing in incorporationApplication.'],
    ['/filing/incorporationApplication/cooperative/rulesFileKey', 'File must be unencrypted.',
      'Rules: File must be unencrypted.'],
    ['/filing/incorporationApplication/cooperative/memorandumFileKey', 'Invalid file.',
      'Memorandum: Invalid file.'],
    ['/filing/incorporationApplication/courtOrder/orderDate', 'Court order date cannot be in the future.',
      'Court order: Court order date cannot be in the future.'],
    ['/filing/incorporationApplication/contactPoint/phone', 'Invalid phone number, expected format: (XXX) XXX-XXXX',
      'Contact information: Invalid phone number, expected format: (XXX) XXX-XXXX'],
    ['/filing/incorporationApplication/contactPoint/extension', 'Invalid extension, maximum 5 digits',
      'Contact information: Invalid extension, maximum 5 digits'],
    ['/filing/incorporationApplication/incorporationAgreement/agreementType', 'Invalid agreement type.',
      'Incorporation agreement: Invalid agreement type.'],
    ['/filing/incorporationApplication/nameTranslations/0/name', 'Invalid name translation.',
      'Name translation: Invalid name translation.'],
    ['/filing/incorporationApplication', 'A valid filing is required.',
      'Incorporation application: A valid filing is required.'],
    ['/filing/header/effectiveDate', 'Invalid Datetime, effective date must be a minimum of 2 minutes ahead.',
      'Effective date: Invalid Datetime, effective date must be a minimum of 2 minutes ahead.']
  ])('decodes %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, iaFiling)).toBe(expected)
  })

  it.each([
    ['/filing/incorporationApplication/parties/0/officer/email', 'Email is required.',
      'Incorporator (Jane Doe) email: Email is required.'],
    ['/filing/incorporationApplication/parties/1/officer/firstName', 'Director first name is required',
      'Director (John Smith) name: Director first name is required'],
    ['/filing/incorporationApplication/parties/1/mailingAddress/postalCode', 'Postal code is required.',
      'Director (John Smith) mailing address: Postal code is required.'],
    ['/filing/incorporationApplication/parties/1/deliveryAddress/streetAddress',
      'streetAddress cannot start or end with whitespace.',
      'Director (John Smith) delivery address: streetAddress cannot start or end with whitespace.'],
    ['/filing/incorporationApplication/parties/1', 'deliveryAddress is required.',
      'Director (John Smith): deliveryAddress is required.'],
    ['/filing/incorporationApplication/parties/2/mailingAddress', 'mailingAddress is required.',
      'Incorporator (Incorporators Ltd) mailing address: mailingAddress is required.'],
    ['/filing/incorporationApplication/parties/1/roles/0/appointmentDate', 'Invalid appointment date.',
      'Director (John Smith) role: Invalid appointment date.']
  ])('names the party for %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, iaFiling)).toBe(expected)
  })

  it.each([
    ['/filing/incorporationApplication/shareClasses/0/name/', 'Share class name cannot contain the words \'share\'.',
      'Share class (Class A Shares): Share class name cannot contain the words \'share\'.'],
    ['/filing/incorporationApplication/shareClasses/1/maxNumberOfShares/', 'Must be a whole number',
      'Share class (Class B Shares): Must be a whole number'],
    ['/filing/incorporationApplication/shareClasses/1/parValue/', 'Must be greater than 0',
      'Share class (Class B Shares): Must be greater than 0'],
    ['/filing/incorporationApplication/shareClasses/1/currency/', 'Share class Class B Shares must specify currency',
      'Share class (Class B Shares): Share class Class B Shares must specify currency'],
    ['/filing/incorporationApplication/shareClasses/0', 'Invalid share class.',
      'Share class (Class A Shares): Invalid share class.'],
    ['/filing/incorporationApplication/shareClasses/0/series/0/name/', 'Share series name must end with \'Shares\'.',
      'Share series (Series 1 Shares): Share series name must end with \'Shares\'.'],
    ['/filing/incorporationApplication/shareClasses/0/series/0/maxNumberOfShares', 'Number must be greater than 0',
      'Share series (Series 1 Shares): Number must be greater than 0'],
    ['/filing/incorporationApplication/shareClasses/1/series/', 'Share class cannot have series.',
      'Share class (Class B Shares): Share class cannot have series.'],
    ['/filing/incorporationApplication/shareStructure/shareClasses/1/name', 'Share class name already used.',
      'Share class (Class B Shares): Share class name already used.'],
    ['/filing/incorporationApplication/shareStructure/shareClasses/0/series/0/name', 'Duplicate series name.',
      'Share series (Series 1 Shares): Duplicate series name.']
  ])('names the share class or series for %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, iaFiling)).toBe(expected)
  })

  it('falls back to the share class and series numbers when the filing is not available', () => {
    expect(DecodeApiError({ error: 'Must be a whole number',
      path: '/filing/incorporationApplication/shareClasses/1/maxNumberOfShares/' }))
      .toBe('Share class 2: Must be a whole number')
    expect(DecodeApiError({ error: 'Invalid series.',
      path: '/filing/incorporationApplication/shareClasses/1/series/2/name' }))
      .toBe('Share series 3 of share class 2: Invalid series.')
    expect(DecodeApiError({ error: 'Postal code is required.',
      path: '/filing/incorporationApplication/parties/0/mailingAddress/postalCode' }))
      .toBe('Party 1 mailing address: Postal code is required.')
  })

  it('decodes a schema error on an incorporation application office', () => {
    const err = {
      path: 'filing/incorporationApplication',
      error: "'postalCode' is a required property",
      context: [{
        message: "'postalCode' is a required property",
        jsonPath: '$.filing.incorporationApplication.offices.registeredOffice.deliveryAddress'
      }]
    }
    expect(DecodeApiError(err, iaFiling))
      .toBe("Registered office delivery address: 'postalCode' is a required property")
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
