import { StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  stateText: 'Base State Text',
  currentDate: null,
  certifyState: {
    certifyFormValid: false,
    certifiedBy: ''
  },
  currentStep: 1,
  isSaving: false,
  isSavingResuming: false,
  isFilingPaying: false,
  defineCompanyStep: {
    valid: false,
    businessContact: {
      email: '',
      confirmEmail: '',
      phone: '',
      phoneExtension: ''
    }
  }
}
