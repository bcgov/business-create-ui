// This is the business logic that allows the Stepper, the Actions, and
// any other component that needs to know how they should behave (ie,
// what to show or enable).

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
  return (!!state.tombStoneModel.entityType && state.stateModel.currentStep < 5)
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
  const step1Valid = true // FOR TESTING ONLY
  const step2Valid = true // FOR TESTING ONLY
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
