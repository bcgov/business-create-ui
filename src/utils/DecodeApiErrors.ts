import { RoleTypes } from '@/enums'

/**
 * An element of the "errors" array in a Business API error response.
 * Validation errors carry "error" and "path" (eg, "/filing/dissolution/parties/0/officer/email").
 * Schema errors also carry "context" items with a "jsonPath" (eg, "$.filing.dissolution.parties[0].officer.email").
 */
export interface ApiErrorIF {
  error?: string
  message?: string
  path?: string
  context?: Array<{ message?: string, jsonPath?: string }>
  [key: string]: any
}

/**
 * Returns the body of a Business API error response.
 * Calls go through the API Gateway, which wraps the API body in "rootCause":
 *   { errorMessage: "API backend third party service error.", rootCause: { errors: [...], filing: {...} } }
 * A direct API call returns the body unwrapped, so fall back to the body itself.
 */
export function GetApiErrorPayload (error: any): any {
  const data = error?.response?.data
  return data?.rootCause || data
}

/**
 * Converts an error path to its segments, without the leading "filing".
 * @example "/filing/dissolution/parties/0/officer/email" -> ["dissolution", "parties", "0", "officer", "email"]
 * @example "$.filing.dissolution.parties[0].officer.email" -> ["dissolution", "parties", "0", "officer", "email"]
 */
function pathSegments (path: string): string[] {
  const segments = path
    .replace(/^\$\.?/, '') // remove leading "$." (schema error json path)
    .replace(/\[(\d+)\]/g, '/$1') // convert [0] -> /0
    .replace(/\./g, '/') // convert dots to slashes
    .split('/')
    .filter(s => s !== '')
  if (segments[0] === 'filing') segments.shift()
  return segments
}

/** Returns the section of the filing echoed by the API (the filing may be wrapped in a "filing" object). */
function filingSection (filing: any, section: string): any {
  return filing?.filing?.[section] || filing?.[section]
}

/** Labels for the dissolution properties the API can report on (without a nested record). */
const DISSOLUTION_LABELS: Record<string, string> = {
  affidavitFileKey: 'Affidavit',
  courtOrder: 'Court order',
  custodialOffice: 'Custodial office',
  details: 'Dissolution details',
  dissolutionDate: 'Dissolution date',
  dissolutionStatementType: 'Dissolution statement',
  dissolutionType: 'Dissolution type',
  parties: 'Parties',
  resolution: 'Resolution'
}

/** Labels for the incorporation application properties the API can report on (without a nested record). */
const INCORPORATION_LABELS: Record<string, string> = {
  contactPoint: 'Contact information',
  cooperative: 'Cooperative documents',
  courtOrder: 'Court order',
  incorporationAgreement: 'Incorporation agreement',
  nameRequest: 'Name request',
  nameTranslations: 'Name translation',
  offices: 'Offices',
  parties: 'Parties',
  shareClasses: 'Share structure',
  shareStructure: 'Share structure'
}

/** Labels for the amalgamation application properties the API can report on (without a nested record). */
const AMALGAMATION_LABELS: Record<string, string> = {
  amalgamatingBusinesses: 'Amalgamating businesses',
  contactPoint: 'Contact information',
  cooperative: 'Cooperative documents',
  courtApproval: 'Court approval',
  courtOrder: 'Court order',
  nameRequest: 'Resulting business name',
  nameTranslations: 'Name translation',
  offices: 'Offices',
  parties: 'Parties',
  resolution: 'Special resolution',
  resolutionDate: 'Special resolution',
  shareClasses: 'Share structure',
  shareStructure: 'Share structure',
  signatory: 'Special resolution',
  signingDate: 'Special resolution',
  type: 'Amalgamation type'
}

/** Labels for the roles of an amalgamating business. */
const AMALGAMATING_BUSINESS_LABELS: Record<string, string> = {
  amalgamating: 'Amalgamating business',
  holding: 'Holding business',
  primary: 'Primary business'
}

/** Labels for the filing header properties the API can report on. */
const HEADER_LABELS: Record<string, string> = {
  certifiedBy: 'Certified by',
  documentOptionalEmail: 'Document email',
  effectiveDate: 'Effective date',
  folioNumber: 'Folio number'
}

/** Labels for the address sub-records of a party or an office. */
const ADDRESS_LABELS: Record<string, string> = {
  deliveryAddress: 'delivery address',
  mailingAddress: 'mailing address'
}

/** Labels for the offices of an incorporation application. */
const OFFICE_LABELS: Record<string, string> = {
  recordsOffice: 'Records office',
  registeredOffice: 'Registered office'
}

/** Labels for the cooperative documents of an incorporation application. */
const COOPERATIVE_DOCUMENT_LABELS: Record<string, string> = {
  memorandumFileKey: 'Memorandum',
  rulesFileKey: 'Rules'
}

/**
 * Describes the party at the given index of a filing section, by role and name.
 * @example "Custodian (Jane Doe)"
 * @example "Director (John Smith)"
 * @example "Completing Party"
 * @example "Party 2" (when the filing is not available)
 */
function partyLabel (filing: any, section: string, index: number): string {
  const parties = filingSection(filing, section)?.parties
  const party = Array.isArray(parties) ? parties[index] : undefined
  if (!party) return `Party ${index + 1}`

  // prefer the role that identifies the record (custodian, director, ...) over completing party
  const roles: string[] = (party.roles || []).map(r => r.roleType).filter(Boolean)
  const role = roles.find(r => r !== RoleTypes.COMPLETING_PARTY) || roles[0] || 'Party'

  const officer = party.officer || {}
  const name = officer.organizationName ||
    [officer.firstName, officer.middleName, officer.lastName].filter(Boolean).join(' ')

  return name ? `${role} (${name})` : role
}

/**
 * Returns the user-facing label of the record a "parties" error path points to.
 * @param segments the path segments after "parties" (eg, ["0", "officer", "email"])
 */
function partiesLabel (segments: string[], filing: any, section: string): string {
  const [index, sub1, sub2] = segments
  // errors on the party list as a whole (eg, "/parties", "/parties/roles", "/parties/mailingAddress")
  if (!/^\d+$/.test(index)) return 'Parties'
  const party = partyLabel(filing, section, +index)
  if (sub1 === 'officer') return (sub2 === 'email') ? `${party} email` : `${party} name`
  if (ADDRESS_LABELS[sub1]) return `${party} ${ADDRESS_LABELS[sub1]}`
  if (sub1 === 'roles') return `${party} role`
  return party
}

/**
 * Returns the user-facing label of the record a dissolution error path points to.
 * Returns undefined when the path is not recognized.
 */
function dissolutionLabel (segments: string[], filing: any): string {
  const [key, sub1] = segments
  if (!key) return 'Dissolution'

  if (key === 'parties') return partiesLabel(segments.slice(1), filing, 'dissolution')

  if (key === 'custodialOffice') {
    return ADDRESS_LABELS[sub1] ? `Custodial office ${ADDRESS_LABELS[sub1]}` : DISSOLUTION_LABELS.custodialOffice
  }

  return DISSOLUTION_LABELS[key]
}

/**
 * Describes the share class at the given index of the incorporation application, by name.
 * @example "Share class (Class A Shares)"
 * @example "Share class 2" (when the filing is not available)
 */
function shareClassLabel (filing: any, section: string, index: number): string {
  const classes = filingSection(filing, section)?.shareStructure?.shareClasses
  const name = Array.isArray(classes) ? classes[index]?.name : undefined
  return name ? `Share class (${name})` : `Share class ${index + 1}`
}

/**
 * Describes the share series at the given indexes of the incorporation application, by name.
 * @example "Share series (Series 1 Shares)"
 * @example "Share series 1 of share class 2" (when the filing is not available)
 */
function shareSeriesLabel (filing: any, section: string, classIndex: number, seriesIndex: number): string {
  const classes = filingSection(filing, section)?.shareStructure?.shareClasses
  const series = Array.isArray(classes) ? classes[classIndex]?.series : undefined
  const name = Array.isArray(series) ? series[seriesIndex]?.name : undefined
  return name ? `Share series (${name})` : `Share series ${seriesIndex + 1} of share class ${classIndex + 1}`
}

/**
 * Returns the user-facing label of the record a share structure error path points to.
 * The API reports share class errors both under "shareStructure/shareClasses/{i}" and under "shareClasses/{i}".
 * @param segments the path segments after "shareClasses" (eg, ["0", "series", "1", "name"])
 */
function shareClassesLabel (segments: string[], filing: any, section: string): string {
  const [index, sub1, seriesIndex] = segments
  if (!/^\d+$/.test(index)) return 'Share structure'
  if (sub1 === 'series' && /^\d+$/.test(seriesIndex)) return shareSeriesLabel(filing, section, +index, +seriesIndex)
  return shareClassLabel(filing, section, +index)
}

/**
 * Returns the user-facing label of the record a share structure error path points to.
 * @param segments the path segments after "shareStructure" or "shareClasses"
 * @param key the segment the path started with ("shareStructure" or "shareClasses")
 */
function shareStructureLabel (key: string, segments: string[], filing: any, section: string): string {
  if (key === 'shareClasses') return shareClassesLabel(segments, filing, section)
  return (segments[0] === 'shareClasses') ? shareClassesLabel(segments.slice(1), filing, section) : 'Share structure'
}

/**
 * Returns the user-facing label of the record an "offices" error path points to.
 * @param segments the path segments after "offices" (eg, ["registeredOffice", "mailingAddress", "postalCode"])
 */
function officesLabel (segments: string[]): string {
  const [officeType, addressType] = segments
  const office = OFFICE_LABELS[officeType]
  if (!office) return 'Offices'
  return ADDRESS_LABELS[addressType] ? `${office} ${ADDRESS_LABELS[addressType]}` : office
}

/**
 * Describes the amalgamating business at the given index of the amalgamation application, by role and name.
 * @example "Holding business (BC1234567)"
 * @example "Amalgamating business (Foreign Co Ltd)"
 * @example "Amalgamating business 2" (when the filing is not available)
 */
function amalgamatingBusinessLabel (filing: any, index: number): string {
  const businesses = filingSection(filing, 'amalgamationApplication')?.amalgamatingBusinesses
  const business = Array.isArray(businesses) ? businesses[index] : undefined
  const role = AMALGAMATING_BUSINESS_LABELS[business?.role] || 'Amalgamating business'
  const name = business?.legalName || business?.identifier
  return name ? `${role} (${name})` : `${role} ${index + 1}`
}

/**
 * Returns the user-facing label of the record an amalgamation application error path points to.
 * Returns undefined when the path is not recognized.
 */
function amalgamationLabel (segments: string[], filing: any): string {
  const [key, sub1, sub2] = segments
  if (!key) return 'Amalgamation application'

  if (key === 'parties') return partiesLabel(segments.slice(1), filing, 'amalgamationApplication')
  if (key === 'offices') return officesLabel(segments.slice(1))
  if (key === 'shareStructure' || key === 'shareClasses') {
    return shareStructureLabel(key, segments.slice(1), filing, 'amalgamationApplication')
  }
  if (key === 'cooperative') return COOPERATIVE_DOCUMENT_LABELS[sub1] || AMALGAMATION_LABELS.cooperative

  if (key === 'amalgamatingBusinesses') {
    if (!/^\d+$/.test(sub1)) return AMALGAMATION_LABELS.amalgamatingBusinesses
    const business = amalgamatingBusinessLabel(filing, +sub1)
    return (sub2 === 'foreignJurisdiction') ? `${business} foreign jurisdiction` : business
  }

  return AMALGAMATION_LABELS[key]
}

/**
 * Returns the user-facing label of the record an incorporation application error path points to.
 * Returns undefined when the path is not recognized.
 */
function incorporationLabel (segments: string[], filing: any): string {
  const [key, sub1] = segments
  if (!key) return 'Incorporation application'

  if (key === 'parties') return partiesLabel(segments.slice(1), filing, 'incorporationApplication')

  if (key === 'offices') return officesLabel(segments.slice(1))
  if (key === 'shareStructure' || key === 'shareClasses') {
    return shareStructureLabel(key, segments.slice(1), filing, 'incorporationApplication')
  }
  if (key === 'cooperative') return COOPERATIVE_DOCUMENT_LABELS[sub1] || INCORPORATION_LABELS.cooperative

  return INCORPORATION_LABELS[key]
}

/**
 * Returns the user-facing label of the record an error path points to, or undefined if unknown.
 * Dissolution, incorporation and amalgamation applications are mapped; other filings fall back to the API message.
 */
function labelForPath (path: string, filing: any): string {
  const [section, ...rest] = pathSegments(path)
  switch (section) {
    case 'business': return 'Business'
    case 'header': return HEADER_LABELS[rest[0]] || 'Filing header'
    case 'dissolution': return dissolutionLabel(rest, filing)
    case 'incorporationApplication': return incorporationLabel(rest, filing)
    case 'amalgamationApplication': return amalgamationLabel(rest, filing)
    case 'specialResolution': return 'Special resolution'
    default: return undefined
  }
}

/**
 * Decodes one API error into a user-friendly message: the record it belongs to, then the API message.
 * The raw path stays out of the message (it is logged to the console by the caller).
 * Validation errors carry the text in "error"; other rejections (eg, Permission Denied, duplicate filing,
 * draft conflicts) carry it in "message" with no path.
 * @param err an element of the "errors" array in the API response
 * @param filing the filing echoed in the API response, used to name parties (optional)
 * @example "Custodian (Jane Doe) delivery address: Address must be in BC."
 */
export function DecodeApiError (err: ApiErrorIF, filing: any = null): string {
  // a schema error carries the detail in its first context item
  const context = err?.context?.[0]
  const path = context?.jsonPath || err?.path
  const message = context?.message || err?.error || err?.message || 'Unknown error'

  const label = path ? labelForPath(path, filing) : undefined
  return label ? `${label}: ${message}` : message
}

/**
 * Decodes every error in an API "errors" array, keeping the other properties of each item.
 * @see DecodeApiError
 */
export function DecodeApiErrors (errors: ApiErrorIF[], filing: any = null): ApiErrorIF[] {
  if (!Array.isArray(errors)) return []
  return errors.map(err => {
    if (typeof err === 'string') return { error: err }
    return { ...err, error: DecodeApiError(err, filing) }
  })
}
