import { useStore } from '@/store/store'
import { AuthorizationRoles, AuthorizedActions } from '@/enums'

/**
 * Whether the specified action is authorized for the current user.
 * Ultimately we'll just check if the fetched permissions includes the specified action.
 * @returns True or False
 */
export function IsAuthorized (action: AuthorizedActions): boolean {
  switch (true) {
    case isBusinessRegistryStaff(): return BusinessRegistryStaffActions.includes(action)
    case isMaximusStaff(): return MaximusStaffActions.includes(action)
    case isContactCentreStaff(): return ContactCentreStaffActions.includes(action)
    case isSbcFieldOfficeStaff(): return SbcFieldOfficeStaffActions.includes(action)
    case isPublicUser(): return PublicUserActions.includes(action)
    default: return false
  }
}

/**
 * Whether the user is Business Registry Staff.
 * Ultimately we won't need this function and we'll just fetch permissions.
 */
function isBusinessRegistryStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.STAFF)
}

/**
 * Whether the user is Maximus Staff.
 * Ultimately we won't need this function and we'll just fetch permissions.
 */
function isMaximusStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.MAXIMUS_STAFF)
}

/**
 * Whether the user is Contact Centre Staff.
 * Ultimately we won't need this function and we'll just fetch permissions.
 */
function isContactCentreStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.CONTACT_CENTRE_STAFF)
}

/**
 * Whether the user is SBC Field Office Staff.
 * Ultimately we won't need this function and we'll just fetch permissions.
 */
function isSbcFieldOfficeStaff (): boolean {
  const store = useStore()
  return store.getAuthRoles.includes(AuthorizationRoles.SBC_STAFF)
}

/**
 * Whether the user is Public User.
 * Ultimately we won't need this function and we'll just fetch permissions.
 */
function isPublicUser (): boolean {
  const store = useStore()
  // need to check other functions since some accounts have overlapping roles
  return (
    !isBusinessRegistryStaff() &&
    !isMaximusStaff() &&
    !isContactCentreStaff() &&
    !isSbcFieldOfficeStaff() &&
    store.getAuthRoles.includes(AuthorizationRoles.PUBLIC_USER)
  )
}

/**
 * The authorized actions if the user is Business Registry Staff.
 * Ultimately we won't need this array and we'll just fetch these.
 */
const BusinessRegistryStaffActions = [
  AuthorizedActions.AMALGAMATION_FILING,
  AuthorizedActions.AML_OVERRIDES,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.BLANK_COMPLETING_PARTY,
  AuthorizedActions.CONTINUATION_IN_FILING,
  AuthorizedActions.COURT_ORDER_POA,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.EDITABLE_COMPLETING_PARTY,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_ADD_BUSINESS,
  AuthorizedActions.FIRM_DISSOLUTION_FILING,
  AuthorizedActions.FIRM_EDITABLE_EMAIL_ADDRESS,
  AuthorizedActions.FIRM_NO_MIN_START_DATE,
  AuthorizedActions.INCORPORATION_APPLICATION_FILING,
  AuthorizedActions.NO_COMPLETING_PARTY_MESSAGE_BOX,
  AuthorizedActions.NO_CONTACT_INFO,
  AuthorizedActions.REGISTRATION_FILING,
  AuthorizedActions.RESTORATION_REINSTATEMENT_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.STAFF_BREADCRUMBS,
  AuthorizedActions.STAFF_COMMENTS,
  AuthorizedActions.STAFF_PAYMENT,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT,
  AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING
]

/**
 * The authorized actions if the user is Maximus Staff.
 * Ultimately we won't need this array and we'll just fetch these.
 */
const MaximusStaffActions = [
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.FIRM_DISSOLUTION_FILING,
  AuthorizedActions.INCORPORATION_APPLICATION_FILING,
  AuthorizedActions.REGISTRATION_FILING,
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT,
  AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING
]

/**
 * The authorized actions if the user is Contact Centre Staff.
 * Ultimately we won't need this array and we'll just fetch these.
 */
const ContactCentreStaffActions = [
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.FIRM_DISSOLUTION_FILING,
  AuthorizedActions.INCORPORATION_APPLICATION_FILING,
  AuthorizedActions.REGISTRATION_FILING,
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT,
  AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING
]

/**
 * The authorized actions if the user is SBC Field Office Staff (aka SBC Staff Tier 2).
 * Ultimately we won't need this array and we'll just fetch these.
 */
const SbcFieldOfficeStaffActions = [
  AuthorizedActions.BLANK_CERTIFY_STATE,
  AuthorizedActions.BLANK_COMPLETING_PARTY,
  AuthorizedActions.EDITABLE_CERTIFY_NAME,
  AuthorizedActions.EDITABLE_COMPLETING_PARTY,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_DISSOLUTION_FILING,
  AuthorizedActions.FIRM_EDITABLE_EMAIL_ADDRESS,
  AuthorizedActions.INCORPORATION_APPLICATION_FILING,
  AuthorizedActions.REGISTRATION_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT,
  AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING
]

/**
 * The authorized actions if use is Public User.
 * Ultimately we won't need this array and we'll just fetch these.
 */
const PublicUserActions = [
  AuthorizedActions.AMALGAMATION_FILING,
  AuthorizedActions.CONTINUATION_IN_FILING,
  AuthorizedActions.FILE_AND_PAY,
  AuthorizedActions.FIRM_DISSOLUTION_FILING,
  AuthorizedActions.INCORPORATION_APPLICATION_FILING,
  AuthorizedActions.REGISTRATION_FILING,
  AuthorizedActions.SAVE_DRAFT,
  AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING
]
