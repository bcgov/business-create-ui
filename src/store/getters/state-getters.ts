// Enums
import { EntityTypes } from '@/enums'
import { NameRequestDetailsIF, NameRequestApplicantIF } from '@/interfaces'

/**
 * Whether the user has "staff" keycloak role.
 */
export const isRoleStaff = (state: any): boolean => {
  return state.stateModel.tombstone.keycloakRoles.includes('staff')
}

/**
 * Whether the user is authorized to edit.
 */
export const isAuthEdit = (state: any): boolean => {
  return state.stateModel.tombstone.authRoles.includes('edit')
}

/**
 * Whether the user is authorized to view.
 */
export const isAuthView = (state: any): boolean => {
  return state.stateModel.tombstone.authRoles.includes('view')
}

/**
 * Whether the entity type has been identified.
 */
export const isEntityType = (state: any): boolean => {
  return !!state.stateModel.nameRequest.entityType
}

/**
 * Whether the entity is a BCOMP.
 */
export const isTypeBcomp = (state: any): boolean => {
  return (state.stateModel.nameRequest.entityType === EntityTypes.BCOMP)
}

/**
 * Whether the entity is a COOP.
 */
export const isTypeCoop = (state: any): boolean => {
  return (state.stateModel.nameRequest.entityType === EntityTypes.COOP)
}

/**
 * Returns the current date.
 */
export const getCurrentDate = (state: any): string => {
  return state.stateModel.currentDate
}

/**
 * Returns the filing id.
 */
export const getFilingId = (state: any): number => {
  return state.stateModel.nameRequest.filingId
}

/**
 * Returns the business identifier.
 */
export const getBusinessIdentifier = (state: any): string => {
  return state.stateModel.nameRequest.nrNumber
}

/**
 * Returns the approved name of a name request.
 */
export const getApprovedName = (state: any): string => {
  return state.stateModel.nameRequest.details.approvedName
}

/**
 * Returns name request details.
 */
export const getNameRequestDetails = (state: any): NameRequestDetailsIF => {
  return state.stateModel.nameRequest.details
}

/**
 * Returns name request applicant information.
 */
export const getNameRequestApplicant = (state: any): NameRequestApplicantIF => {
  return state.stateModel.nameRequest.applicant
}

/**
 * Returns the office addresses.
 */
export const getOfficeAddresses = (state: any): string => {
  return state.stateModel.defineCompanyStep.officeAddresses
}

//
// Below is the business logic that allows the Stepper, the Actions, and
// any other component that needs to know how they should behave (ie,
// what to show or enable).
//

/**
 * Whether Back button should be displayed.
 */
export const isShowBackBtn = (state: any): boolean => {
  return (state.stateModel.currentStep > 1)
}

/**
 * Whether Review and Confirm button should be displayed.
 */
export const isShowReviewConfirmBtn = (state: any, getters: any): boolean => {
  return (!!state.stateModel.nameRequest.entityType && state.stateModel.currentStep < getters.getMaxStep)
}

/**
 * Whether File and Pay button should be displayed.
 */
export const isShowFilePayBtn = (state: any, getters: any): boolean => {
  return (state.stateModel.currentStep === getters.getMaxStep)
}

/**
 * Whether File and Pay button should be enabled.
 */
export const isEnableFilePayBtn = (state: any): boolean => {
  const step1Valid = state.stateModel.defineCompanyStep.valid
  const step2Valid = state.stateModel.addPeopleAndRoleStep.valid
  const step3Valid = true // FOR TESTING ONLY
  const step4Valid = true // FOR TESTING ONLY
  const step5Valid = true // FOR TESTING ONLY
  return (step1Valid && step2Valid && step3Valid && step4Valid && step5Valid &&
    state.stateModel.certifyState.certifyFormValid)
}

/**
 * Whether app is busy saving or resuming.
 */
export const isBusySaving = (state: any): boolean => {
  return (state.stateModel.isSaving || state.stateModel.isSavingResuming || state.stateModel.isFilingPaying)
}

/**
 * Whether all the incorporation steps are valid.
 */
export const isApplicationValid = (state: any): boolean => {
  return (state.stateModel.defineCompanyStep.valid && state.stateModel.addPeopleAndRoleStep.valid)
}

/**
 * Returns the array of steps.
 */
export const getSteps = (state: any, getters: any): Array<any> => {
  const steps: Array<any> = [{
    id: 'step-1-btn',
    step: 1,
    icon: 'mdi-domain',
    text: 'Define Your\nCompany',
    to: '/define-company',
    disabled: getters.isBusySaving,
    valid: state.stateModel.defineCompanyStep.valid
  },
  {
    id: 'step-2-btn',
    step: 2,
    icon: 'mdi-account-multiple-plus',
    text: 'Add People\nand Roles',
    to: '/add-people-roles',
    disabled: getters.isBusySaving,
    valid: state.stateModel.addPeopleAndRoleStep.valid
  },
  {
    id: 'step-3-btn',
    step: 3,
    icon: getters.isTypeBcomp ? 'mdi-sitemap' : 'mdi-format-list-text',
    text: getters.isTypeBcomp ? 'Create Share\nStructure' : 'Create\nRules',
    to: getters.isTypeBcomp ? '/create-share-structure' : '/create-rules',
    disabled: getters.isTypeBcomp ? getters.isBusySaving : true,
    valid: getters.isTypeBcomp ? state.stateModel.createShareStructureStep.valid : false
  },
  {
    id: 'step-4-btn',
    step: -1,
    icon: getters.isTypeBcomp ? 'mdi-handshake' : 'mdi-text-box-multiple',
    text: getters.isTypeBcomp ? 'Incorporation\nAgreement' : 'Create\nMemorandum',
    to: getters.isTypeBcomp ? '/incorporation-agreement' : '/create-memorandum',
    disabled: true,
    valid: false
  },
  {
    id: 'step-5-btn',
    step: 4,
    icon: 'mdi-text-box-check-outline',
    text: 'Review\nand Confirm',
    to: '/review-confirm',
    disabled: getters.isBusySaving,
    valid: getters.isApplicationValid
  }]
  return steps
}

/**
 * Returns the maximum step number.
 */
export const getMaxStep = (state: any, getters: any): number => {
  return getters.getSteps ? getters.getSteps.filter(step => step.step !== -1).length : -1
}
