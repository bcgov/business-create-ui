import { CertifyIF } from '../stepper-interfaces/certify-interface'

// State model example
export interface StateModelIF {
  stateText: string | undefined
  currentDate: string
  certifyState: CertifyIF
  currentStep: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
}
