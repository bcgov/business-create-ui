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
    expect(DecodeApiError({ error: 'Something is wrong.', path: '/filing/continuationIn/offices' }, filing))
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

  it('uses the "message" property when the API error has no "error" (eg, Permission Denied)', () => {
    // shapes from legal-api check_filing_enabled, put_basic_checks and the draft rebase guard
    expect(DecodeApiError({
      message: 'Permission Denied - transition filing is currently not available for this user and/or account.'
    })).toBe('Permission Denied - transition filing is currently not available for this user and/or account.')
    expect(DecodeApiError({ message: 'Illegal to attempt to create a duplicate filing for BC1234567.' }))
      .toBe('Illegal to attempt to create a duplicate filing for BC1234567.')
    // "error" wins when both are present
    expect(DecodeApiError({ error: 'From error', message: 'From message' })).toBe('From error')
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

// filing echoed by the API in its error response (regular amalgamation of two BC companies and a foreign one)
const amlFiling = {
  header: { name: 'amalgamationApplication' },
  business: { identifier: 'TRtKAWg7Ah', legalType: 'BC' },
  amalgamationApplication: {
    type: 'regular',
    amalgamatingBusinesses: [
      { role: 'amalgamating', identifier: 'BC1234567' },
      { role: 'holding', identifier: 'BC7654321' },
      {
        role: 'amalgamating',
        identifier: 'A0000001',
        legalName: 'Foreign Co Ltd',
        foreignJurisdiction: { country: 'US', region: 'WA' }
      }
    ],
    nameRequest: { legalType: 'BC' },
    parties: [
      {
        officer: { partyType: 'person', firstName: 'Jane', lastName: 'Doe' },
        roles: [{ roleType: 'Completing Party' }]
      },
      {
        officer: { partyType: 'person', firstName: 'John', lastName: 'Smith' },
        roles: [{ roleType: 'Director' }]
      }
    ],
    shareStructure: { shareClasses: [{ name: 'Class A Shares', series: [{ name: 'Series 1 Shares' }] }] }
  }
}

describe('DecodeApiError - amalgamation application', () => {
  it.each([
    ['/filing/amalgamationApplication/type', 'Invalid amalgamation type.',
      'Amalgamation type: Invalid amalgamation type.'],
    ['/filing/amalgamationApplication/amalgamatingBusinesses',
      'Regular amalgamation must have 2 or more amalgamating businesses.',
      'Amalgamating businesses: Regular amalgamation must have 2 or more amalgamating businesses.'],
    ['/filing/amalgamationApplication/amalgamatingBusinesses',
      'Duplicate amalgamating business entry found in list: BC1234567.',
      'Amalgamating businesses: Duplicate amalgamating business entry found in list: BC1234567.'],
    ['/filing/amalgamationApplication/nameRequest/legalName', 'Legal name does not match the holding business.',
      'Resulting business name: Legal name does not match the holding business.'],
    ['/filing/amalgamationApplication/nameRequest/nrNumber', 'Short-form amalgamations cannot have a Name Request.',
      'Resulting business name: Short-form amalgamations cannot have a Name Request.'],
    ['/filing/amalgamationApplication/nameRequest/legalType',
      'Legal type should be same as the legal type in primary or holding business.',
      'Resulting business name: Legal type should be same as the legal type in primary or holding business.'],
    ['/filing/amalgamationApplication/offices', "Offices do not match the holding business's current offices.",
      "Offices: Offices do not match the holding business's current offices."],
    ['/filing/amalgamationApplication/offices/registeredOffice/mailingAddress/postalCode', 'Postal code is required.',
      'Registered office mailing address: Postal code is required.'],
    ['/filing/amalgamationApplication/offices/recordsOffice/deliveryAddress', "Address Country must be 'CA'.",
      "Records office delivery address: Address Country must be 'CA'."],
    ['/filing/amalgamationApplication/parties', 'At least one Director and a Completing Party is required.',
      'Parties: At least one Director and a Completing Party is required.'],
    ['/filing/amalgamationApplication/parties/roles', 'Invalid party role(s) provided: incorporator.',
      'Parties: Invalid party role(s) provided: incorporator.'],
    ['/filing/amalgamationApplication/shareStructure',
      "Share structure does not match the holding business's current share structure.",
      "Share structure: Share structure does not match the holding business's current share structure."],
    ['/filing/amalgamationApplication/shareStructure/resolutionDates', 'Resolution dates do not match.',
      'Share structure: Resolution dates do not match.'],
    ['/filing/amalgamationApplication/shareStructure/shareClasses',
      'A company must have at least one Class of Shares.',
      'Share structure: A company must have at least one Class of Shares.'],
    ['/filing/amalgamationApplication/courtOrder/orderDate', 'Court order date cannot be in the future.',
      'Court order: Court order date cannot be in the future.'],
    ['/filing/amalgamationApplication/courtApproval', 'Court approval is required.',
      'Court approval: Court approval is required.'],
    ['/filing/amalgamationApplication/cooperative/rulesFileKey', 'Invalid file.', 'Rules: Invalid file.'],
    ['/filing/amalgamationApplication/cooperative', 'cooperative data is missing in amalgamationApplication.',
      'Cooperative documents: cooperative data is missing in amalgamationApplication.'],
    ['/filing/amalgamationApplication/resolution', 'Resolution must be provided.',
      'Special resolution: Resolution must be provided.'],
    ['/filing/amalgamationApplication/resolutionDate', 'Resolution date is required.',
      'Special resolution: Resolution date is required.'],
    ['/filing/amalgamationApplication/signingDate', 'Signing date cannot be in the future.',
      'Special resolution: Signing date cannot be in the future.'],
    ['/filing/amalgamationApplication/signatory/givenName', 'Signatory given name is required.',
      'Special resolution: Signatory given name is required.'],
    ['/filing/amalgamationApplication/contactPoint/phone', 'Invalid phone number, expected format: (XXX) XXX-XXXX',
      'Contact information: Invalid phone number, expected format: (XXX) XXX-XXXX'],
    ['/filing/amalgamationApplication/nameTranslations/0/name', 'Invalid name translation.',
      'Name translation: Invalid name translation.'],
    ['/filing/amalgamationApplication', 'A valid filing is required.',
      'Amalgamation application: A valid filing is required.']
  ])('decodes %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, amlFiling)).toBe(expected)
  })

  it.each([
    ['/filing/amalgamationApplication/amalgamatingBusinesses/0', 'BC1234567 is not in good standing.',
      'Amalgamating business (BC1234567): BC1234567 is not in good standing.'],
    ['/filing/amalgamationApplication/amalgamatingBusinesses/1',
      'BC7654321 has a draft, pending or future effective filing.',
      'Holding business (BC7654321): BC7654321 has a draft, pending or future effective filing.'],
    ['/filing/amalgamationApplication/amalgamatingBusinesses/2',
      'A Foreign Co Ltd foreign corporation cannot be marked as Primary or Holding.',
      'Amalgamating business (Foreign Co Ltd): ' +
      'A Foreign Co Ltd foreign corporation cannot be marked as Primary or Holding.'],
    ['/filing/amalgamationApplication/amalgamatingBusinesses/2/foreignJurisdiction/region',
      'Region should not be BC.',
      'Amalgamating business (Foreign Co Ltd) foreign jurisdiction: Region should not be BC.'],
    ['/filing/amalgamationApplication/amalgamatingBusinesses/2/foreignJurisdiction/country', 'Invalid country.',
      'Amalgamating business (Foreign Co Ltd) foreign jurisdiction: Invalid country.']
  ])('names the amalgamating business for %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, amlFiling)).toBe(expected)
  })

  it.each([
    ['/filing/amalgamationApplication/parties/1/mailingAddress/postalCode', 'Postal code is required.',
      'Director (John Smith) mailing address: Postal code is required.'],
    ['/filing/amalgamationApplication/parties/1', 'deliveryAddress is required.',
      'Director (John Smith): deliveryAddress is required.'],
    ['/filing/amalgamationApplication/parties/0/officer/email', 'Email is required.',
      'Completing Party (Jane Doe) email: Email is required.'],
    ['/filing/amalgamationApplication/shareClasses/0/name/',
      "Share class name 'Class A Shares' must end with 'Shares'.",
      "Share class (Class A Shares): Share class name 'Class A Shares' must end with 'Shares'."],
    ['/filing/amalgamationApplication/shareStructure/shareClasses/0/series/0/maxNumberOfShares',
      'Number must be greater than 0', 'Share series (Series 1 Shares): Number must be greater than 0']
  ])('names the party, share class or series for %s', (path, message, expected) => {
    expect(DecodeApiError({ error: message, path }, amlFiling)).toBe(expected)
  })

  it('falls back to the business number when the filing is not available', () => {
    expect(DecodeApiError({ error: 'BC1234567 is frozen.',
      path: '/filing/amalgamationApplication/amalgamatingBusinesses/1' }))
      .toBe('Amalgamating business 2: BC1234567 is frozen.')
    const noName = { amalgamationApplication: { amalgamatingBusinesses: [{ role: 'primary' }] } }
    expect(DecodeApiError({ error: 'Not found.',
      path: '/filing/amalgamationApplication/amalgamatingBusinesses/0' }, noName))
      .toBe('Primary business 1: Not found.')
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

  it('decodes errors that carry a "message" instead of an "error"', () => {
    const errors = [{ message: "A filing was completed after this draft's base transaction. Reload the draft." }]
    expect(DecodeApiErrors(errors)).toEqual([{
      message: "A filing was completed after this draft's base transaction. Reload the draft.",
      error: "A filing was completed after this draft's base transaction. Reload the draft."
    }])
  })

  it('wraps plain string errors and tolerates a non-array', () => {
    expect(DecodeApiErrors(['Plain message'] as any)).toEqual([{ error: 'Plain message' }])
    expect(DecodeApiErrors(null as any)).toEqual([])
    expect(DecodeApiErrors({ message: 'x' } as any)).toEqual([])
  })
})
