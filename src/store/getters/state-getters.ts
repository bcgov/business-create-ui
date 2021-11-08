import { AccountTypes, CoopType, CorpTypeCd, DissolutionTypes, FilingNames, FilingTypes } from '@/enums'
import {
  AccountInformationIF,
  AddressIF,
  BusinessContactIF, BusinessIF,
  CertifyIF,
  CourtOrderStepIF,
  CreateMemorandumIF,
  CreateRulesIF,
  DefineCompanyIF,
  DissolutionStatementIF,
  DocumentDeliveryIF,
  EffectiveDateTimeIF,
  FeesIF,
  IncorporationAgreementIF,
  NameRequestApplicantIF,
  NameRequestDetailsIF,
  NameRequestIF,
  NameTranslationIF,
  PeopleAndRoleIF,
  ShareStructureIF,
  StaffPaymentStepIF,
  StateIF,
  TombstoneIF,
  UploadAffidavitIF,
  CreateResolutionIF, OrgPersonIF
} from '@/interfaces'
import { getMaxStep } from './resource-getters'

//
// The getters in this file return values from the current state model.
//

/** Whether the current filing is an Incorporation. */
export const isIncorporationFiling = (state: StateIF): boolean => {
  return getFilingType(state) === FilingTypes.INCORPORATION_APPLICATION
}

/** Whether the current filing is a Dissolution. */
export const isDissolutionFiling = (state: StateIF): boolean => {
  return getFilingType(state) === FilingTypes.DISSOLUTION
}

/** The current filing type. */
export const getFilingType = (state: StateIF): FilingTypes => {
  return state.stateModel.tombstone.filingType
}

/** The current filing name. */
export const getFilingName = (state: StateIF): FilingNames => {
  switch (getFilingType(state)) {
    case FilingTypes.INCORPORATION_APPLICATION:
      return FilingNames.INCORPORATION_APPLICATION
    case FilingTypes.DISSOLUTION:
      return FilingNames.VOLUNTARY_DISSOLUTION_FILING
    default:
      return null // Should never happen
  }
}

/** The dissolution filing type. */
export const getDissolutionType = (state: StateIF): DissolutionTypes => {
  return state.stateModel.dissolution.dissolutionType
}

/** The dissolution statement step. */
export const getDissolutionStatementStep = (state: StateIF): DissolutionStatementIF => {
  return state.stateModel.dissolution.dissolutionStatementStep
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

/** Whether the entity type has been identified. */
export const isEntityType = (state: StateIF): boolean => {
  return !!getEntityType(state)
}

/** The current entityType. */
export const getEntityType = (state: StateIF): CorpTypeCd => {
  return state.stateModel.entityType
}

/** The account folio number. */
export const getAccountFolioNumber = (state: StateIF): string => {
  return state.stateModel.tombstone.folioNumber
}

/** Whether the entity is a BCOMP. */
export const isTypeBcomp = (state: StateIF): boolean => {
  return (state.stateModel.entityType === CorpTypeCd.BENEFIT_COMPANY)
}

/** Whether the entity is a COOP. */
export const isTypeCoop = (state: StateIF): boolean => {
  return (state.stateModel.entityType === CorpTypeCd.COOP)
}

/** Whether the entity is Community Contribution Company. */
export const isTypeCC = (state: StateIF): boolean => {
  return (state.stateModel.entityType === CorpTypeCd.BC_CCC)
}

/** The Account Information object. */
export const getAccountInformation = (state: StateIF): AccountInformationIF => {
  return state.stateModel.accountInformation
}

/** Whether the entity is a base company (BEN, CC, BC, ULC). */
export const isBaseCompany = (state: StateIF): boolean => {
  return [
    CorpTypeCd.BENEFIT_COMPANY,
    CorpTypeCd.BC_CCC,
    CorpTypeCd.BC_COMPANY,
    CorpTypeCd.BC_ULC_COMPANY
  ].includes(getEntityType(state))
}

/** Whether the current account is a premium account. */
export const isPremiumAccount = (state: StateIF): boolean => {
  return (getAccountInformation(state).accountType === AccountTypes.PREMIUM)
}

/** The current date, which is refreshed every time the app inits. */
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

/** The Business Legal Name. */
export const getBusinessLegalName = (state: StateIF): string => {
  return state.stateModel.business.legalName
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
export const getCooperativeType = (state: StateIF): CoopType => {
  return getDefineCompanyStep(state).cooperativeType
}

/** The Business Contact object. */
export const getBusinessContact = (state: StateIF): BusinessContactIF => {
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
  return getAffidavitStep(state).validationDetail.valid
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

/** Whether the Back button should be displayed. */
export const isShowBackBtn = (state: StateIF): boolean => {
  return (getCurrentStep(state) > 1)
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

/** Whether all the incorporation steps are valid. */
export const isApplicationValid = (state: StateIF): boolean => {
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
    getAddPeopleAndRoleStep(state).valid &&
    isDocumentValid &&
    isCertifyValid
  )
}

/** Is true when the user has tried to submit a filing. */
export const getValidateSteps = (state: StateIF): boolean => {
  return state.stateModel.validateSteps
}

/** Is true when the user should see the validation errors. */
export const getShowErrors = (state: StateIF): boolean => {
  return state.stateModel.showErrors
}

/** The Certify State object. */
export const getCertifyState = (state: StateIF): CertifyIF => {
  return state.stateModel.certifyState
}

/** The users's email address. */
export const getUserEmail = (state: StateIF): string => {
  return (state.stateModel.tombstone.userEmail)
}

/** The users's phone number. */
export const getUserPhone = (state: StateIF): string => {
  return state.stateModel.tombstone.userPhone
}

/** The user's first name. */
export const getUserFirstName = (state: StateIF): string => {
  return (state.stateModel.tombstone.userFirstName)
}

/** The user's last name. */
export const getUserLastName = (state: StateIF): string => {
  return (state.stateModel.tombstone.userLastName)
}

/** The user's keycloak guid. */
export const getUserKeycloakGuid = (state: StateIF): string => {
  return (state.stateModel.tombstone.userKeycloakGuid)
}

/** The user's address. */
export const getUserAddress = (state: StateIF): AddressIF => {
  return (state.stateModel.tombstone.userAddress)
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

/** The custodian email. */
export const getCustodianEmail = (state: StateIF): string => {
  return getCustodian(state)?.officer.email || '(Not entered)'
}

export const getDocumentDelivery = (state: StateIF): DocumentDeliveryIF => {
  return state.stateModel.documentDelivery
}

/** The custodian of records. */
export const getCustodian = (state: StateIF): OrgPersonIF => {
  return state.stateModel.dissolution.custodianOfRecords.custodian
}
