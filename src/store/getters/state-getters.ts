import {
  AccountTypes,
  CoopTypes,
  CorpTypeCd,
  DissolutionTypes,
  FilingNames,
  FilingTypes,
  FilingTypesSubTitle
} from '@/enums'
import {
  AccountInformationIF,
  AddressIF,
  ContactPointIF,
  BusinessIF,
  CertifyIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateResolutionIF,
  CreateRulesIF,
  DefineCompanyIF,
  DissolutionStatementIF,
  DissolutionStateIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  IncorporationAgreementIF,
  NameRequestApplicantIF,
  NameRequestDetailsIF,
  NameRequestIF,
  NameTranslationIF,
  OrgPersonIF,
  PeopleAndRoleIF,
  RegistrationStateIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  StateIF,
  TombstoneIF,
  UploadAffidavitIF,
  OrgInformationIF,
  CompletingPartyIF
} from '@/interfaces'
import { getMaxStep } from './resource-getters'

/** Whether the current filing is an Incorporation. */
export const isIncorporationFiling = (state: StateIF): boolean => {
  return getFilingType(state) === FilingTypes.INCORPORATION_APPLICATION
}

/** Whether the current filing is a Dissolution. */
export const isDissolutionFiling = (state: StateIF): boolean => {
  return getFilingType(state) === FilingTypes.VOLUNTARY_DISSOLUTION
}

/** Whether the current filing is a Registration. */
export const isRegistrationFiling = (state: StateIF): boolean => {
  return getFilingType(state) === FilingTypes.REGISTRATION
}

/** The current filing type. */
export const getFilingType = (state: StateIF): FilingTypes => {
  return getTombstone(state).filingType
}

/** The current filing name. */
export const getFilingName = (state: StateIF): FilingNames => {
  switch (getFilingType(state)) {
    case FilingTypes.INCORPORATION_APPLICATION: return FilingNames.INCORPORATION_APPLICATION
    case FilingTypes.REGISTRATION: return FilingNames.REGISTRATION
    case FilingTypes.VOLUNTARY_DISSOLUTION:
      if (isTypeFirm(state)) {
        return FilingNames.DISSOLUTION_FIRM
      }
      return FilingNames.VOLUNTARY_DISSOLUTION

    default: return null // should never happen
  }
}

/** Whether the user has "staff" auth role. */
export const isRoleStaff = (state: StateIF): boolean => {
  return getTombstone(state).authRoles.includes('staff')
}

/** Whether the user is authorized to edit. */
export const isAuthEdit = (state: StateIF): boolean => {
  return getTombstone(state).authRoles.includes('edit')
}

/** Whether the user is authorized to view. */
export const isAuthView = (state: StateIF): boolean => {
  return getTombstone(state).authRoles.includes('view')
}

/** Whether the user has "gov account user" auth role. */
export const isGovAccountUser = (state: StateIF): boolean => {
  return getTombstone(state).authRoles.includes('gov_account_user')
}

/** Whether the user is SBC Staff (which is not the same as Staff). */
export const isSbcStaff = (state: StateIF): boolean => {
  if (isGovAccountUser(state)) {
    const orgInfo = getOrgInformation(state)
    return (orgInfo?.branchName?.includes('Service BC') || false)
  }
  return false
}

/** Whether the entity type has been identified. */
export const isEntityType = (state: StateIF): boolean => {
  return !!getEntityType(state)
}

/** The current entityType. */
export const getEntityType = (state: StateIF): CorpTypeCd => {
  return state.stateModel.entityType
}

/** The account folio number. */
export const getFolioNumber = (state: StateIF): string => {
  return getTombstone(state).folioNumber
}

/** The transactional folio number. */
export const getTransactionalFolioNumber = (state: StateIF): string => {
  return getTombstone(state).transactionalFolioNumber
}

/** Is true when the transactional folio number is valid. */
export const getTransactionalFolioNumberValid = (state: StateIF): boolean => {
  return getTombstone(state).transactionalFolioNumberValid
}

/** The staff payment folio number. */
export const getStaffPaymentFolioNumber = (state: StateIF): string => {
  return getStaffPaymentStep(state).staffPayment.folioNumber
}

/** Whether the entity is a Benefit Company. */
export const isTypeBcomp = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BENEFIT_COMPANY)
}

/** Whether the entity is a Cooperative Assocation. */
export const isTypeCoop = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.COOP)
}

/** Whether the entity is a BC Community Contribution Company. */
export const isTypeBcCcc = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BC_CCC)
}

/** Whether the entity is a BC Company. */
export const isTypeBcCompany = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BC_COMPANY)
}

/** Whether the entity is a BC ULC Company. */
export const isTypeBcUlcCompany = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.BC_ULC_COMPANY)
}

/** Whether the entity is a Sole Proprietorship. */
export const isTypeSoleProp = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.SOLE_PROP)
}

/** Whether the entity is a General Partnership. */
export const isTypePartnership = (state: StateIF): boolean => {
  return (getEntityType(state) === CorpTypeCd.PARTNERSHIP)
}

/** Is True if entity is a Sole Proprietorship or General Partnership. */
export const isTypeFirm = (state: StateIF): boolean => {
  return (isTypeSoleProp(state) || isTypePartnership(state))
}

/** The Account Information object. */
export const getAccountInformation = (state: StateIF): AccountInformationIF => {
  return state.stateModel.accountInformation
}

/** Whether the entity is a base company (BEN, CC, BC, ULC). */
export const isBaseCompany = (state: StateIF): boolean => {
  return (
    isTypeBcomp(state) ||
    isTypeBcCcc(state) ||
    isTypeBcCompany(state) ||
    isTypeBcUlcCompany(state)
  )
}

/** Whether the current account is a premium account. */
export const isPremiumAccount = (state: StateIF): boolean => {
  return (getAccountInformation(state).accountType === AccountTypes.PREMIUM)
}

/** The Org Information object. */
export const getOrgInformation = (state: StateIF): OrgInformationIF => {
  return state.stateModel.orgInformation
}

/** The current date, which is refreshed every time the app inits (YYYY-MM-DD). */
export const getCurrentDate = (state: StateIF): string => {
  return state.stateModel.currentDate
}

/** The current JS Date object, which is refreshed every minute. */
export const getCurrentJsDate = (state: StateIF): Date => {
  return state.stateModel.currentJsDate
}

/** The Filing ID. */
export const getFilingId = (state: StateIF): number => {
  return state.stateModel.filingId
}

/** The Temporary Business Identifier. */
export const getTempId = (state: StateIF): string => {
  return state.stateModel.tempId
}

/** The Business Identifier. */
export const getBusinessId = (state: StateIF): string => {
  return state.stateModel.business.businessId
}

export const getEntityIdentifier = (state: StateIF): string => {
  switch (getFilingType(state)) {
    case FilingTypes.VOLUNTARY_DISSOLUTION: return getBusinessId(state)
    case FilingTypes.INCORPORATION_APPLICATION: return getTempId(state)
    case FilingTypes.REGISTRATION: return getTempId(state)
  }
}

/** The Business Legal Name. */
export const getBusinessLegalName = (state: StateIF): string => {
  return state.stateModel.business.legalName
}

/** The Business Founding Date. */
export const getBusinessFoundingDate = (state: StateIF): string => {
  return state.stateModel.business.foundingDate
}

/** The Business Data. */
export const getBusiness = (state: StateIF): BusinessIF => {
  return state.stateModel.business
}

/** Whether this IA is for a Named Business. */
export const isNamedBusiness = (state: StateIF): boolean => {
  // a named business has a NR number
  return !!getNameRequestNumber(state)
}

/** The Number of a Name Request. */
export const getNameRequestNumber = (state: StateIF): string => {
  return getNameRequest(state).nrNumber
}

/** The Approved Name of a Name Request. */
export const getApprovedName = (state: StateIF): string => {
  return (getNameRequestDetails(state) as NameRequestDetailsIF).approvedName
}

/** The Tombstone object. */
export const getTombstone = (state: StateIF): TombstoneIF => {
  return state.stateModel.tombstone
}

/** The Company Step object. */
export const getDefineCompanyStep = (state: StateIF): DefineCompanyIF => {
  return state.stateModel.defineCompanyStep
}

/** The Cooperative association type. */
export const getCooperativeType = (state: StateIF): CoopTypes => {
  return getDefineCompanyStep(state).cooperativeType
}

/** The Business Contact object. */
export const getBusinessContact = (state: StateIF): ContactPointIF => {
  return state.stateModel.businessContact
}

/** The Memorandum object. */
export const getMemorandum = (state: StateIF): any => {
  return {} // FUTURE: implement this
}

/** The Add People and Role object. */
export const getAddPeopleAndRoleStep = (state: StateIF): PeopleAndRoleIF => {
  return state.stateModel.addPeopleAndRoleStep
}

/** The Create Share Structure object. */
export const getCreateShareStructureStep = (state: StateIF): ShareStructureIF => {
  return state.stateModel.createShareStructureStep
}

/** The Create Rules object. */
export const getCreateRulesStep = (state: StateIF): CreateRulesIF => {
  return state.stateModel.createRulesStep
}

/** Is true when the step is valid. */
export const isRulesValid = (state: StateIF): boolean => {
  return getCreateRulesStep(state).validationDetail.valid
}

/** The Incorporation Agreement object. */
export const getIncorporationAgreementStep = (state: StateIF): IncorporationAgreementIF => {
  return state.stateModel.incorporationAgreementStep
}

/** Is true when the step is valid. */
export const isMemorandumValid = (state: StateIF): boolean => {
  return getCreateMemorandumStep(state).validationDetail.valid
}

/** The Create Memorandum object. */
export const getCreateMemorandumStep = (state: StateIF): CreateMemorandumIF => {
  return state.stateModel.createMemorandumStep
}

/** Is true when the step is valid. */
export const isAffidavitValid = (state: StateIF): boolean => {
  if (isTypeCoop(state)) {
    return getAffidavitStep(state).validationDetail.valid
  } else {
    // Just validate the confirm checkbox for Corps
    return getAffidavitStep(state).validationDetail.validationItemDetails[0]?.valid
  }
}

/** The upload Affidavit object. */
export const getAffidavitStep = (state: StateIF): UploadAffidavitIF => {
  return state.stateModel.uploadAffidavitStep
}

/** Is true when the step is valid. */
export const isResolutionValid = (state: StateIF): boolean => {
  return getCreateResolutionStep(state).validationDetail.valid
}

/** The Create Special Resolution object. */
export const getCreateResolutionStep = (state: StateIF): CreateResolutionIF => {
  return state.stateModel.createResolutionStep
}

/** The Effective Date-Time object. */
export const getEffectiveDateTime = (state: StateIF): EffectiveDateTimeIF => {
  return state.stateModel.effectiveDateTime
}

/** The Name Request object. */
export const getNameRequest = (state: StateIF): NameRequestIF => {
  return state.stateModel.nameRequest
}

/** The Name Request Details object. */
export const getNameRequestDetails = (state: StateIF): NameRequestDetailsIF | {} => {
  return getNameRequest(state).details
}

/** The Name Request Applicant object. */
export const getNameRequestApplicant = (state: StateIF): NameRequestApplicantIF | {} => {
  return getNameRequest(state).applicant
}

/** The Name Translations object array. */
export const getNameTranslations = (state: StateIF): NameTranslationIF[] => {
  return state.stateModel.nameTranslations
}

/** Whether we are ignoring data changes. */
export const ignoreChanges = (state: StateIF): boolean => {
  return state.stateModel.ignoreChanges
}

/** Whether there are unsaved data changes. */
export const getHaveChanges = (state: StateIF): boolean => {
  return state.stateModel.haveChanges
}

//
// Below is the business logic that allows the Stepper, the Actions, etc
// to know how they should behave (ie, what to show or enable).
//

/** The current step. */
export const getCurrentStep = (state: StateIF): number => {
  return state.stateModel.currentStep
}

/** Whether the app is busy saving. */
export const isSaving = (state: StateIF): boolean => {
  return state.stateModel.isSaving
}

/** Whether the app is busy saving and resuming. */
export const isSavingResuming = (state: StateIF): boolean => {
  return state.stateModel.isSavingResuming
}

/** Whether the app is busy filing and paying. */
export const isFilingPaying = (state: StateIF): boolean => {
  return state.stateModel.isFilingPaying
}

/** Whether the Review and Confirm button should be displayed. */
export const isShowReviewConfirmBtn = (state: StateIF): boolean => {
  return (!!getEntityType(state) && getCurrentStep(state) < getMaxStep(state))
}

/** Whether the File and Pay button should be displayed. */
export const isShowFilePayBtn = (state: StateIF): boolean => {
  return (getCurrentStep(state) === getMaxStep(state))
}

/** Whether the app is busy saving or resuming. */
export const isBusySaving = (state: StateIF): boolean => {
  return (isSaving(state) || isSavingResuming(state) || isFilingPaying(state))
}

/** Is true when the step is valid. */
export const isDefineCompanyValid = (state: StateIF): boolean => {
  // If entity is a Coop, check for Coop Type assignment, flagged valid for non-coop entities.
  const isValidCoopType = isTypeCoop(state) ? !!getCooperativeType(state) : true

  return getDefineCompanyStep(state).valid && isValidCoopType
}

/** Is true when the step is valid. */
export const isAddPeopleAndRolesValid = (state: StateIF): boolean => {
  return getAddPeopleAndRoleStep(state).valid
}

/** Is true when the step is valid. */
export const isCreateShareStructureValid = (state: StateIF): boolean => {
  return getCreateShareStructureStep(state).valid
}

/** Is true when the step is valid. */
export const isIncorporationAgreementValid = (state: StateIF): boolean => {
  return getIncorporationAgreementStep(state).valid
}

/** Whether all the steps are valid. */
export const isApplicationValid = (state: StateIF): boolean => {
  if (isIncorporationFiling(state)) return isIncorporationApplicationValid(state)
  if (isDissolutionFiling(state)) return isDissolutionValid(state)
  if (isRegistrationFiling(state)) return isRegistrationValid(state)
  return false
}

/** Whether all the dissolution steps are valid. */
export const isDissolutionValid = (state: StateIF): boolean => {
  const isDocumentDeliveryValid = getDocumentDelivery(state).valid
  const isCertifyValid = getCertifyState(state).valid && !!getCertifyState(state).certifiedBy

  // only for Premium account
  const isTransactionalFnValid = !isPremiumAccount(state) || getTransactionalFolioNumberValid(state)

  // only for Staff role
  const isCourtOrderValid = isRoleStaff(state) ? getCourtOrderStep(state).valid : true
  const isStaffPaymentValid = isRoleStaff(state) ? getStaffPaymentStep(state).valid : true

  const isEffectiveDateTimeValid = isBaseCompany(state) ? getEffectiveDateTime(state).valid : true

  if (isTypeFirm(state)) {
    return (
      isDocumentDeliveryValid &&
      isTransactionalFnValid &&
      isCertifyValid &&
      isEffectiveDateTimeValid &&
      isCourtOrderValid &&
      isStaffPaymentValid
    )
  }
  return (
    isDissolutionDefineDissolutionValid(state) &&
    isAffidavitValid(state) &&
    isResolutionValid(state) &&
    isDocumentDeliveryValid &&
    isTransactionalFnValid &&
    isCertifyValid &&
    isEffectiveDateTimeValid &&
    isCourtOrderValid &&
    isStaffPaymentValid
  )
}

/** Whether all the incorporation steps are valid. */
export const isIncorporationApplicationValid = (state: StateIF): boolean => {
  // Base company steps
  const isBaseStepsValid = (
    getCreateShareStructureStep(state).valid &&
    getEffectiveDateTime(state).valid &&
    getIncorporationAgreementStep(state).valid
  )

  // Coop steps
  const isCoopStepsValid = (
    getCooperativeType(state) &&
    getCreateRulesStep(state).validationDetail.valid &&
    getCreateMemorandumStep(state).validationDetail.valid
  )

  // Validate different steps for Base Companies vs Coops
  const isDocumentValid = isBaseCompany(state) ? isBaseStepsValid : isCoopStepsValid

  const isCertifyValid = getCertifyState(state).valid && !!getCertifyState(state).certifiedBy

  return (
    getDefineCompanyStep(state).valid &&
    isAddPeopleAndRolesValid(state) &&
    isDocumentValid &&
    isCertifyValid
  )
}

/** Whether all the registration steps are valid. */
export const isRegistrationValid = (state: StateIF): boolean => {
  const isCertifyValid = getCertifyState(state).valid && !!getCertifyState(state).certifiedBy
  // const isFeeAcknowledgementValid = getRegistration(state).feeAcknowledgement
  const isFeeAcknowledgementValid = true // FUTURE: use line above instead
  const isStaffPaymentValid = isRoleStaff(state) ? getStaffPaymentStep(state).valid : true

  return (
    getRegistration(state).defineBusinessValid &&
    isAddPeopleAndRolesValid(state) &&
    isCertifyValid &&
    isFeeAcknowledgementValid &&
    isStaffPaymentValid
  )
}

/**
 * Is true when the user has tried to submit a filing,
 * ie, after clicking File and Pay.
 */
export const getValidateSteps = (state: StateIF): boolean => {
  return state.stateModel.validateSteps
}

/**
 * Is true when the user should see the validation errors,
 * ie, after navigating to review page.
 */
export const getShowErrors = (state: StateIF): boolean => {
  return state.stateModel.showErrors
}

/** The Certify State object. */
export const getCertifyState = (state: StateIF): CertifyIF => {
  return state.stateModel.certifyState
}

/** The users's email address. */
export const getUserEmail = (state: StateIF): string => {
  return (getTombstone(state).userEmail)
}

/** The users's phone number. */
export const getUserPhone = (state: StateIF): string => {
  return getTombstone(state).userPhone
}

/** The user's first name. */
export const getUserFirstName = (state: StateIF): string => {
  return (getTombstone(state).userFirstName)
}

/** The user's last name. */
export const getUserLastName = (state: StateIF): string => {
  return (getTombstone(state).userLastName)
}

/** The user's keycloak guid. */
export const getUserKeycloakGuid = (state: StateIF): string => {
  return (getTombstone(state).userKeycloakGuid)
}

/** The user's address. */
export const getUserAddress = (state: StateIF): AddressIF => {
  return (getTombstone(state).userAddress)
}

/** The fee prices. */
export const getFeePrices = (state: StateIF): Array<FeesIF> => {
  return state.stateModel.feePrices
}

/** The staff payment step. */
export const getStaffPaymentStep = (state: StateIF): StaffPaymentStepIF => {
  return state.stateModel.staffPaymentStep
}

/** The court order step state. */
export const getCourtOrderStep = (state: StateIF): CourtOrderStepIF => {
  return state.stateModel.courtOrderStep
}

export const getDocumentDelivery = (state: StateIF): DocumentDeliveryIF => {
  return state.stateModel.documentDelivery
}

//
// Dissolution getters
//

/** The dissolution object. */
export const getDissolution = (state: StateIF): DissolutionStateIF => {
  return state.stateModel.dissolution
}

/** The dissolution statement step. */
export const getDissolutionStatementStep = (state: StateIF): DissolutionStatementIF => {
  return getDissolution(state).dissolutionStatementStep
}

/** The dissolution type. */
export const getDissolutionType = (state: StateIF): DissolutionTypes => {
  return getDissolution(state).dissolutionType
}

export const getDissolutionHasCertificateDestroyed = (state: StateIF): boolean => {
  return getDissolution(state).hasCertificateDestroyed
}

/** Is true when the custodian data is valid. */
export const isDissolutionCustodianValid = (state: StateIF): boolean => {
  return getDissolution(state).custodianOfRecords.valid
}

/** The dissolution custodian of records. */
export const getDissolutionCustodian = (state: StateIF): OrgPersonIF => {
  return getDissolution(state).custodianOfRecords.custodian
}

/** The custodian email. */
export const getDissolutionCustodianEmail = (state: StateIF): string => {
  return getDissolutionCustodian(state)?.officer.email
}

/** Is true when the Define Dissolution page is valid. */
export const isDissolutionDefineDissolutionValid = (state: StateIF): boolean => {
  const isCoopDefineDissolutionValid = isTypeCoop(state)
    ? (getDissolutionStatementStep(state).valid && getDissolutionHasCertificateDestroyed(state))
    : true

  return isCoopDefineDissolutionValid && isDissolutionCustodianValid(state)
}

//
// Registration getters
//

/** The registration object. */
export const getRegistration = (state: StateIF): RegistrationStateIF => {
  return state.stateModel.registration
}

// current filing subtitle
export const getFilingSubtitle = (state: StateIF): string => {
  if (isDissolutionFiling(state) && isTypeFirm(state)) {
    return FilingTypesSubTitle.SOLE_PROP_SUB_TITLE
  }
  return null
}

/** The completing party data. */
export const getCompletingParty = (state: StateIF): CompletingPartyIF => {
  return state.stateModel.completingParty
}

/** The dissolution date */
export const getDissolutionDate = (state: StateIF): string => {
  return getDissolution(state).dissolutionDate
}
