import { AuthorizedActions } from '@/enums'

/** The authorized actions if the user is Business Registry Staff. */
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

/** The authorized actions if the user is Maximus Staff. */
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

/** The authorized actions if the user is Contact Centre Staff. */
const ContactCentreStaffActions = [
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.FIRM_DISSOLUTION_FILING,
  AuthorizedActions.INCORPORATION_APPLICATION_FILING,
  AuthorizedActions.REGISTRATION_FILING,
  AuthorizedActions.SBC_BREADCRUMBS,
  AuthorizedActions.THIRD_PARTY_CERTIFY_STMT,
  AuthorizedActions.VOLUNTARY_DISSOLUTION_FILING
]

/** The authorized actions if the user is SBC Field Office Staff (aka SBC Staff Tier 2). */
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

/** The authorized actions if use is Public User. */
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
