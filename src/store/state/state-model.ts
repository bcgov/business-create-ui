import { StateModelIF, NameRequestApplicantIF, NameRequestDetailsIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  tombstone: {
    keycloakRoles: [],
    authRoles: []
  },
  nameRequest: {
    nrNumber: '',
    entityType: '',
    details: {} as NameRequestDetailsIF,
    applicant: {} as NameRequestApplicantIF,
    filingId: null as number
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
      extension: ''
    },
    officeAddresses: {}
  },
  addPeopleAndRoleStep: {
    valid: false,
    orgPeople: []
  },
  createShareStructureStep: {
    valid: false,
    shareClasses: []
  }
}
