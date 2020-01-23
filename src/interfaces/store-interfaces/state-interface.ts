import { CertifyIF } from '../stepper-interfaces/ReviewConfirm/certify-interface'
import { DefineCompanyIF } from '../stepper-interfaces/DefineCompany/define-company-interface'

// State model example
export interface StateModelIF {
  stateText: string | undefined
  currentDate: string | null
  certifyState: CertifyIF
  currentStep: number
  isSaving: boolean
  isSavingResuming: boolean
  isFilingPaying: boolean
  defineCompanyStep: DefineCompanyIF
}
