import { StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
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
    },
    nameRequest: {
      nrNumber: '',
      entityType: '',
      filingId: null
    }
  }
}
