import { AddressIF } from '@bcrs-shared-components/interfaces'
import { AddressSchemaIF, OrgPersonIF, RegisteredRecordsAddressesIF, ShareClassIF }
  from '@/interfaces'
import { OfficeAddressSchema, PersonAddressSchema } from '@/schemas'
import { CurrencyCodes } from '@/constants'
import { PartyTypes, RoleTypes } from '@/enums'
import { SignificantDigits } from './SignificantDigits'

/**
 * Validators for amalgamation data that was prepopulated (from the holding/primary
 * business or a COLIN snapshot) or restored from a draft, and therefore never passed
 * through the add/edit forms that normally enforce these rules.
 *
 * These deliberately mirror legal-api's filing validations (common_validations.py:
 * validate_party_name, validate_addresses, validate_shares, validate_series,
 * validate_share_currency) so this catches anything that would fail at submission.
 */

// legal-api common_validations.py party name limits (COLIN sync constraints), enforced
// on the filings legal-api syncs back to COLIN (IA, amalgamation, continuation-in)
export const PARTY_FIRST_MIDDLE_NAME_MAX_LENGTH = 20
// limit for filings without the COLIN sync check (registration, restoration), matching
// the RegAddEditOrgPerson form rules and legal-api's 30-char parties table columns
export const FIRM_PARTY_FIRST_MIDDLE_NAME_MAX_LENGTH = 30
export const PARTY_LAST_NAME_MAX_LENGTH = 30

// legal-api common_validations.py share structure constants
const SHARE_NAME_SUFFIX = ' Shares'
const EXCLUDED_WORDS_FOR_CLASS = ['share', 'shares', 'value']
const EXCLUDED_WORDS_FOR_SERIES = ['share', 'shares']
const MAX_SHARE_DIGITS = 20
const MAX_SHARE_SIG_DIGITS = 16
const MAX_PAR_VALUE_LENGTH = 38
const MAX_PAR_VALUE_SIG_DIGITS = 16

/**
 * Whether the address satisfies every rule in the subject Vuelidate schema.
 * NB - Vuelidate validators are plain (value, parentVm) functions, so they can be
 *      evaluated directly against the address object.
 * @param address the address to validate (invalid if nullish)
 * @param schema the Vuelidate schema to validate against
 */
export function IsAddressValid (address: AddressIF, schema: AddressSchemaIF): boolean {
  if (!address) return false
  return Object.keys(schema).every(field =>
    Object.values(schema[field]).every(
      (rule: (value: any, parentVm: any) => boolean) => !!rule(address[field], address)
    )
  )
}

/** Whether the optional name is absent/blank or within the max length. */
function isValidOptionalName (name: string, maxLength: number): boolean {
  const trimmed = name?.trim()
  if (!trimmed) return true // legal-api skips blank optional names
  return (trimmed.length <= maxLength)
}

/**
 * Returns the list of data issues for the org-person (empty if it is complete).
 * NB - the name rules mirror legal-api's validate_party_name.
 * @param orgPerson the org-person to validate
 * @param skipPersonNameChecks whether to skip the person name checks (for names the
 *                             user is not allowed to edit, eg a locked Completing Party)
 * @param firstMiddleMaxLength the first/middle name limit for the subject filing
 */
export function GetOrgPersonIssues (
  orgPerson: OrgPersonIF,
  skipPersonNameChecks = false,
  firstMiddleMaxLength = PARTY_FIRST_MIDDLE_NAME_MAX_LENGTH
): string[] {
  const issues: string[] = []
  const officer: any = orgPerson?.officer
  if (!officer) return ['Officer information is missing']

  // check names
  if (officer.partyType === PartyTypes.ORGANIZATION) {
    if (!officer.organizationName?.trim()) issues.push('Organization name is missing')
    // person name fields must not be set on an organization
    if (
      officer.firstName?.trim() || officer.middleName?.trim() ||
      officer.middleInitial?.trim() || officer.lastName?.trim()
    ) issues.push('Unexpected person name')
  } else {
    if (!skipPersonNameChecks) {
      // NB - the API does not require a first name; when present it must fit the filing's limit
      if (!isValidOptionalName(officer.firstName, firstMiddleMaxLength)) {
        issues.push(`First name exceeds ${firstMiddleMaxLength} characters`)
      }
      if (!officer.lastName?.trim()) {
        issues.push('Last name is missing')
      } else if (officer.lastName.trim().length > PARTY_LAST_NAME_MAX_LENGTH) {
        issues.push(`Last name exceeds ${PARTY_LAST_NAME_MAX_LENGTH} characters`)
      }
      if (!isValidOptionalName(officer.middleName, firstMiddleMaxLength)) {
        issues.push(`Middle name exceeds ${firstMiddleMaxLength} characters`)
      }
      if (!isValidOptionalName(officer.middleInitial, firstMiddleMaxLength)) {
        issues.push(`Middle initial exceeds ${firstMiddleMaxLength} characters`)
      }
    }
    // organization name must not be set on a person
    if (officer.organizationName?.trim()) issues.push('Unexpected organization name')
  }

  // check mailing address
  if (!IsAddressValid(orgPerson.mailingAddress, PersonAddressSchema)) {
    issues.push('Mailing Address is incorrect or incomplete')
  }

  // directors, proprietors and partners also require a complete delivery address
  const requiresDeliveryAddress = orgPerson.roles?.some(role =>
    [RoleTypes.DIRECTOR, RoleTypes.PROPRIETOR, RoleTypes.PARTNER].includes(role.roleType)
  )
  if (requiresDeliveryAddress && !IsAddressValid(orgPerson.deliveryAddress, PersonAddressSchema)) {
    issues.push('Delivery Address is incorrect or incomplete')
  }

  return issues
}

/**
 * Whether the org-person has the names and addresses the filing requires.
 * @param orgPerson the org-person to validate
 * @param skipPersonNameChecks whether to skip the person name checks
 * @param firstMiddleMaxLength the first/middle name limit for the subject filing
 */
export function IsOrgPersonComplete (
  orgPerson: OrgPersonIF,
  skipPersonNameChecks = false,
  firstMiddleMaxLength = PARTY_FIRST_MIDDLE_NAME_MAX_LENGTH
): boolean {
  return (GetOrgPersonIssues(orgPerson, skipPersonNameChecks, firstMiddleMaxLength).length === 0)
}

/**
 * Whether every org-person in the list is complete.
 * @param orgPeople the org-person list to validate (an empty list is valid)
 * @param completingPartyNameLocked whether the Completing Party's name is pre-populated
 *                                  from the user's login and not editable — its name
 *                                  checks are skipped since the user cannot fix them
 * @param firstMiddleMaxLength the first/middle name limit for the subject filing
 */
export function AreOrgPersonsComplete (
  orgPeople: OrgPersonIF[],
  completingPartyNameLocked = false,
  firstMiddleMaxLength = PARTY_FIRST_MIDDLE_NAME_MAX_LENGTH
): boolean {
  return (orgPeople || []).every(orgPerson => IsOrgPersonComplete(
    orgPerson,
    completingPartyNameLocked &&
      !!orgPerson.roles?.some(role => role.roleType === RoleTypes.COMPLETING_PARTY),
    firstMiddleMaxLength
  ))
}

/**
 * Returns the list of data issues for an office (empty if it is complete).
 * @param office the office (mailing + delivery addresses) to validate
 */
export function GetOfficeIssues (office: { mailingAddress?: AddressIF, deliveryAddress?: AddressIF }): string[] {
  const issues: string[] = []
  if (!IsAddressValid(office?.mailingAddress, OfficeAddressSchema)) {
    issues.push('Mailing Address is incorrect or incomplete')
  }
  if (!IsAddressValid(office?.deliveryAddress, OfficeAddressSchema)) {
    issues.push('Delivery Address is incorrect or incomplete')
  }
  return issues
}

/**
 * Whether the registered and records office addresses are complete.
 * @param addresses the office addresses to validate
 */
export function AreOfficesComplete (addresses: RegisteredRecordsAddressesIF): boolean {
  return (
    GetOfficeIssues(addresses?.registeredOffice).length === 0 &&
    GetOfficeIssues(addresses?.recordsOffice).length === 0
  )
}

/**
 * Returns the length of the number in plain decimal form (no exponent), the same form
 * legal-api measures par values in (format(Decimal(...).normalize(), 'f')).
 * NB - assumes a positive finite number.
 */
function plainDecimalLength (value: number): number {
  const [mantissa, exponent] = String(value).toLowerCase().split('e')
  if (exponent === undefined) return mantissa.length

  const exp = +exponent
  const digits = mantissa.replace('.', '')
  const pointIndex = mantissa.indexOf('.')
  const intLength = (pointIndex === -1) ? mantissa.length : pointIndex
  const newPointPos = intLength + exp

  if (newPointPos >= digits.length) return newPointPos // whole number padded with zeros
  if (newPointPos > 0) return digits.length + 1 // decimal point sits inside the digits
  return digits.length + 2 + (-newPointPos) // "0." plus leading zeros plus the digits
}

/** Whether the share name is well-formed, per legal-api's name checks. */
function isValidShareName (name: string, excludedWords: string[], usedNames: string[]): boolean {
  const trimmed = (typeof name === 'string') ? name.trim() : ''
  if (!trimmed) return false
  if (!trimmed.endsWith(SHARE_NAME_SUFFIX)) return false
  const words = trimmed.slice(0, -SHARE_NAME_SUFFIX.length).toLowerCase().split(/\s+/)
  if (words.some(word => excludedWords.includes(word))) return false
  if (usedNames.includes(trimmed)) return false
  usedNames.push(trimmed)
  return true
}

/** Whether the maximum number of shares is a valid whole number within the digit limits. */
function isValidMaxShares (value: any): boolean {
  if (typeof value !== 'number' || !Number.isInteger(value)) return false
  if (value <= 0) return false
  if (plainDecimalLength(value) > MAX_SHARE_DIGITS) return false
  return (SignificantDigits(value) <= MAX_SHARE_SIG_DIGITS)
}

/** Whether the par value is a valid positive number within the digit limits. */
function isValidParValue (value: any): boolean {
  if (typeof value !== 'number' || !isFinite(value)) return false
  if (value <= 0) return false
  if (plainDecimalLength(value) > MAX_PAR_VALUE_LENGTH) return false
  return (SignificantDigits(value) <= MAX_PAR_VALUE_SIG_DIGITS)
}

/**
 * Whether the share structure is non-empty and every class/series would pass legal-api's
 * validate_share_structure + validate_share_currency.
 * @param shareClasses the share classes (and their series) to validate
 */
export function IsShareStructureComplete (shareClasses: ShareClassIF[]): boolean {
  if (!shareClasses?.length) return false

  const classNames: string[] = []
  return shareClasses.every(shareClass => {
    if (!isValidShareName(shareClass.name, EXCLUDED_WORDS_FOR_CLASS, classNames)) return false
    if (shareClass.hasMaximumShares && !isValidMaxShares(shareClass.maxNumberOfShares)) return false
    if (shareClass.hasParValue) {
      if (!isValidParValue(shareClass.parValue)) return false
      if (!CurrencyCodes.has(shareClass.currency)) return false
    }
    // resulting amalgamation types are all corps: series require rights or restrictions
    if (shareClass.series?.length && !shareClass.hasRightsOrRestrictions) return false

    const seriesNames: string[] = []
    return (shareClass.series || []).every(series => {
      if (!isValidShareName(series.name, EXCLUDED_WORDS_FOR_SERIES, seriesNames)) return false
      if (series.hasMaximumShares) {
        if (!isValidMaxShares(series.maxNumberOfShares)) return false
        // a series cannot have more shares than its class
        if (
          shareClass.hasMaximumShares &&
          isValidMaxShares(shareClass.maxNumberOfShares) &&
          (series.maxNumberOfShares > shareClass.maxNumberOfShares)
        ) return false
      }
      return true
    })
  })
}
