// This is the business logic that allows the Stepper, the Actions, and
// any other component that needs to know how they should behave (ie,
// what to show or enable).

// Enums
import { EntityTypes } from '@/enums'

/**
 * Whether the client has staff keycloak role
 */
export const isRoleStaff = (state: any): boolean => {
  return state.stateModel.tombstone.keycloakRoles.includes('staff')
}

/**
 * Whether the client has edit permissions
 */
export const isRoleEdit = (state: any): boolean => {
  return state.stateModel.tombstone.authRoles.includes('edit')
}

/**
 * Whether the client has view permissions
 */
export const isRoleView = (state: any): boolean => {
  return state.stateModel.tombstone.authRoles.includes('view')
}

/**
 * A boolean indicating whether the entity type has been identified
 */
export const isEntityType = (state: any): boolean => {
  return !!state.stateModel.nameRequest.entityType
}

/**
 * A boolean indicating whether the entity type is a BCOMP
 */
export const isTypeBcomp = (state: any): boolean => {
  return (state.stateModel.nameRequest.entityType === EntityTypes.BCOMP)
}

/**
 * A boolean indicating whether the entity type is a COOP
 */
export const isTypeCoop = (state: any): boolean => {
  return (state.stateModel.nameRequest.entityType === EntityTypes.COOP)
}

/**
 * Return a filingId if it exists
 */
export const getFilingId = (state: any): number => {
  return state.stateModel.nameRequest.filingId
}

/**
 * Return a business identifier if it exists
 */
export const getBusinessIdentifier = (state: any): string => {
  return state.stateModel.nameRequest.nrNumber
}

/**
 * Return Office addresses
 */
export const getOfficeAddresses = (state: any): string => {
  return state.stateModel.defineCompanyStep.officeAddresses
}

/**
 * Whether Back button should be displayed.
 */
export const isShowBackBtn = (state: any): boolean => {
  return (state.stateModel.currentStep > 1)
}

/**
 * Whether Review and Confirm button should be displayed.
 */
export const isShowReviewConfirmBtn = (state: any, getters:any): boolean => {
  return (!!state.stateModel.nameRequest.entityType && state.stateModel.currentStep < getters.getMaxStep)
}

/**
 * Whether File and Pay button should be displayed.
 */
export const isShowFilePayBtn = (state: any, getters:any): boolean => {
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
 * Validate all the incorporation steps
 */
export const isApplicationValid = (state: any): boolean => {
  return (state.stateModel.defineCompanyStep.valid && state.stateModel.addPeopleAndRoleStep.valid)
}

/**
 * Steps to be displayed in the stepper
 */
export const getSteps = (state: any, getters:any): Array<any> => {
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
    step: -1,
    icon: getters.isTypeBcomp ? 'mdi-sitemap' : 'mdi-format-list-text',
    text: getters.isTypeBcomp ? 'Create Share\nStructure' : 'Create\nRules',
    to: '/step-3',
    disabled: true,
    valid: false
  },
  {
    id: 'step-4-btn',
    step: -1,
    icon: getters.isTypeBcomp ? 'mdi-handshake' : 'mdi-file-document-box-multiple',
    text: getters.isTypeBcomp ? 'Incorporation\nAgreement' : 'Create\nMemorandum',
    to: '/step-4',
    disabled: true,
    valid: false
  },
  {
    id: 'step-5-btn',
    step: 3,
    icon: getters.isTypeBcomp ? 'mdi-text-box-check-outline' : 'mdi-file-document-box-check-outline',
    text: 'Review\nand Confirm',
    to: '/review-confirm',
    disabled: getters.isBusySaving,
    valid: getters.isApplicationValid
  }]
  return steps
}

export const getMaxStep = (state: any, getters:any): number => {
  return getters.getSteps ? getters.getSteps.filter(step => step.step !== -1).length : -1
}
