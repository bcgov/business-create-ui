// State model example
export interface StateModelIF {
  stateText: string | undefined
  currentStep: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
}
