import { StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  tombstone: {
    keycloakRoles: [],
    authRoles: []
  },
  nameRequest: {
    nrNumber: '',
    entityType: '',
    filingId: null
  },
  currentDate: '',
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
    officeAddresses: {}
  }
}
