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
export const isShowReviewConfirmBtn = (state: any): boolean => {
  return (!!state.stateModel.nameRequest.entityType && state.stateModel.currentStep < 5)
}

/**
 * Whether File and Pay button should be displayed.
 */
export const isShowFilePayBtn = (state: any): boolean => {
  return (state.stateModel.currentStep === 5)
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
