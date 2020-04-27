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
  incorporationDateTime: {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  },
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  currentStep: 1,
  isSaving: false,
  isSavingResuming: false,
  isFilingPaying: false,
  ignoreChanges: false,
  haveChanges: false,
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
