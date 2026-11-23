import { RoleTypes } from '@/enums'

/**
 * An element of the "errors" array in a Business API error response.
 * Validation errors carry "error" and "path" (eg, "/filing/dissolution/parties/0/officer/email").
 * Schema errors also carry "context" items with a "jsonPath" (eg, "$.filing.dissolution.parties[0].officer.email").
 */
export interface ApiErrorIF {
  error?: string
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

/**
 * Describes the party at the given index of the dissolution filing, by role and name.
 * @example "Custodian (Jane Doe)"
 * @example "Completing Party"
 * @example "Party 2" (when the filing is not available)
 */
function dissolutionPartyLabel (filing: any, index: number): string {
  const parties = filing?.filing?.dissolution?.parties || filing?.dissolution?.parties
  const party = Array.isArray(parties) ? parties[index] : undefined
  if (!party) return `Party ${index + 1}`

  // prefer the role that identifies the record (custodian or liquidator) over completing party
  const roles: string[] = (party.roles || []).map(r => r.roleType).filter(Boolean)
  const role = roles.find(r => r !== RoleTypes.COMPLETING_PARTY) || roles[0] || 'Party'

  const officer = party.officer || {}
  const name = officer.organizationName ||
    [officer.firstName, officer.middleName, officer.lastName].filter(Boolean).join(' ')

  return name ? `${role} (${name})` : role
}

/**
 * Returns the user-facing label of the record a dissolution error path points to.
 * Returns undefined when the path is not recognized.
 */
function dissolutionLabel (segments: string[], filing: any): string {
  const [key, sub1, sub2] = segments
  if (!key) return 'Dissolution'

  if (key === 'parties') {
    if (!/^\d+$/.test(sub1)) return DISSOLUTION_LABELS.parties
    const party = dissolutionPartyLabel(filing, +sub1)
    if (sub2 === 'officer') return (segments[3] === 'email') ? `${party} email` : `${party} name`
    if (ADDRESS_LABELS[sub2]) return `${party} ${ADDRESS_LABELS[sub2]}`
    if (sub2 === 'roles') return `${party} role`
    return party
  }

  if (key === 'custodialOffice') {
    return ADDRESS_LABELS[sub1] ? `Custodial office ${ADDRESS_LABELS[sub1]}` : DISSOLUTION_LABELS.custodialOffice
  }

  return DISSOLUTION_LABELS[key]
}

/**
 * Returns the user-facing label of the record an error path points to, or undefined if unknown.
 * Only the dissolution filing is mapped so far; other filings fall back to the API message alone.
 */
function labelForPath (path: string, filing: any): string {
  const [section, ...rest] = pathSegments(path)
  switch (section) {
    case 'business': return 'Business'
    case 'header': return HEADER_LABELS[rest[0]] || 'Filing header'
    case 'dissolution': return dissolutionLabel(rest, filing)
    case 'specialResolution': return 'Special resolution'
    default: return undefined
  }
}

/**
 * Decodes one API error into a user-friendly message: the record it belongs to, then the API message.
 * The raw path stays out of the message (it is logged to the console by the caller).
 * @param err an element of the "errors" array in the API response
 * @param filing the filing echoed in the API response, used to name parties (optional)
 * @example "Custodian (Jane Doe) delivery address: Address must be in BC."
 */
export function DecodeApiError (err: ApiErrorIF, filing: any = null): string {
  // a schema error carries the detail in its first context item
  const context = err?.context?.[0]
  const path = context?.jsonPath || err?.path
  const message = context?.message || err?.error || 'Unknown error'

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
